import { existsSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { rgbToLab } from './lab'
import type { RawImage } from './imageio'
import { getGenAIClient } from '../gemini'

export interface FaceInfo {
  cx: number
  top: number
  width: number
  height: number
  chin: number
}

export interface SegmentationResult {
  /** soft hair alpha 0..1 (feathered edges) */
  alpha: Float32Array
  /** hard binary hair mask */
  mask: Uint8Array
  face: FaceInfo
  crownRef: [number, number, number] | null
  method: 'segformer_hair_model' | 'gemini_mask+skin_exclusion' | 'local_face_background_skin'
  notes: string[]
}

/* ---------------- low level helpers ---------------- */

function labelComponents(bin: Uint8Array, w: number, h: number) {
  const n = w * h
  const labels = new Int32Array(n).fill(-1)
  const sizes: number[] = []
  const queue = new Int32Array(n)
  for (let s = 0; s < n; s++) {
    if (!bin[s] || labels[s] !== -1) continue
    const id = sizes.length
    let head = 0
    let tail = 0
    let size = 0
    queue[tail++] = s
    labels[s] = id
    while (head < tail) {
      const p = queue[head++]
      size++
      const x = p % w
      if (x > 0 && bin[p - 1] && labels[p - 1] === -1) { labels[p - 1] = id; queue[tail++] = p - 1 }
      if (x < w - 1 && bin[p + 1] && labels[p + 1] === -1) { labels[p + 1] = id; queue[tail++] = p + 1 }
      if (p >= w && bin[p - w] && labels[p - w] === -1) { labels[p - w] = id; queue[tail++] = p - w }
      if (p < n - w && bin[p + w] && labels[p + w] === -1) { labels[p + w] = id; queue[tail++] = p + w }
    }
    sizes.push(size)
  }
  return { labels, sizes }
}

function morph(src: Uint8Array, w: number, h: number, r: number, dilate: boolean) {
  const tmp = new Uint8Array(w * h)
  const out = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = dilate ? 0 : 1
      for (let k = -r; k <= r; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k))
        const val = src[y * w + xx]
        if (dilate ? val : !val) { v = dilate ? 1 : 0; break }
      }
      tmp[y * w + x] = v
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = dilate ? 0 : 1
      for (let k = -r; k <= r; k++) {
        const yy = Math.min(h - 1, Math.max(0, y + k))
        const val = tmp[yy * w + x]
        if (dilate ? val : !val) { v = dilate ? 1 : 0; break }
      }
      out[y * w + x] = v
    }
  }
  return out
}

function morphOpen(src: Uint8Array, w: number, h: number, r = 1) {
  return morph(morph(src, w, h, r, false), w, h, r, true)
}

function morphClose(src: Uint8Array, w: number, h: number, r = 1) {
  return morph(morph(src, w, h, r, true), w, h, r, false)
}

/**
 * Separable 2D Gaussian blur filter for smooth alpha mask edge feathering (2-5px radius).
 * Eliminates harsh jagged staircasing and creates natural hair-strand gradient falloffs.
 */
function gaussianBlur(src: Float32Array, w: number, h: number, r = 3): Float32Array {
  const sigma = Math.max(0.8, r / 2)
  const size = 2 * r + 1
  const kernel = new Float32Array(size)
  let kSum = 0
  for (let i = 0; i < size; i++) {
    const x = i - r
    kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma))
    kSum += kernel[i]
  }
  for (let i = 0; i < size; i++) kernel[i] /= kSum

  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)

  // Horizontal pass
  for (let y = 0; y < h; y++) {
    const yOffset = y * w
    for (let x = 0; x < w; x++) {
      let sum = 0
      for (let k = -r; k <= r; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k))
        sum += src[yOffset + xx] * kernel[k + r]
      }
      tmp[yOffset + x] = sum
    }
  }

  // Vertical pass
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let sum = 0
      for (let k = -r; k <= r; k++) {
        const yy = Math.min(h - 1, Math.max(0, y + k))
        sum += tmp[yy * w + x] * kernel[k + r]
      }
      out[y * w + x] = sum
    }
  }

  return out
}

function boxBlur(src: Float32Array, w: number, h: number, r: number) {
  return gaussianBlur(src, w, h, r)
}

const median = (arr: number[]) => {
  if (!arr.length) return 0
  const s = [...arr].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

function dE(lab: Float32Array, i: number, ref: ArrayLike<number>) {
  const dl = lab[i * 3] - ref[0]
  const da = lab[i * 3 + 1] - ref[1]
  const db = lab[i * 3 + 2] - ref[2]
  return Math.sqrt(dl * dl + da * da + db * db)
}

/* ---------------- skin / face / background ---------------- */

function skinMask(img: RawImage) {
  const { data, width: w, height: h } = img
  const m = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]
    const y = 0.299 * r + 0.587 * g + 0.114 * b
    if (y < 35 || y > 248) continue
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b
    const isYCbCrSkin = cr >= 133 && cr <= 178 && cb >= 77 && cb <= 130
    const isRgbSkin = r > g && g >= b * 0.8 && r - g >= 8 && r - b >= 10
    if (isYCbCrSkin && isRgbSkin) m[i] = 1
  }
  return m
}

/**
 * Secondary skin-detection and erosion step to prevent dye bleed
 * onto forehead, temples, ears, neck, and clothing collars.
 */
function suppressSkinSpill(
  hairMask: Uint8Array,
  img: RawImage,
  lab: Float32Array,
  face: FaceInfo | null,
  faceBin: Uint8Array | null,
  crownRef: [number, number, number] | null
): Uint8Array {
  const { width: w, height: h } = img
  const n = w * h
  const cleaned = new Uint8Array(hairMask)
  const rawSkin = skinMask(img)
  // Dilate skin by 2px to catch forehead and ear boundaries
  const skinExpanded = morph(rawSkin, w, h, 2, true)

  const fcx = face?.cx ?? w / 2
  const ftop = face?.top ?? h * 0.2
  const fwidth = face?.width ?? w * 0.5
  const fheight = face?.height ?? h * 0.4
  const fchin = face?.chin ?? ftop + fheight

  // Sample skin reference color from inner facial region
  let skinRef: [number, number, number] | null = null
  const samples: number[] = []
  const yStart = Math.round(ftop + 0.3 * fheight)
  const yEnd = Math.round(ftop + 0.65 * fheight)
  const xStart = Math.round(fcx - 0.25 * fwidth)
  const xEnd = Math.round(fcx + 0.25 * fwidth)
  for (let y = yStart; y <= yEnd; y++) {
    for (let x = xStart; x <= xEnd; x++) {
      const idx = y * w + x
      if (rawSkin[idx]) samples.push(idx)
    }
  }
  if (samples.length > 25) {
    skinRef = [
      median(samples.map(i => lab[i * 3])),
      median(samples.map(i => lab[i * 3 + 1])),
      median(samples.map(i => lab[i * 3 + 2]))
    ]
  }

  for (let i = 0; i < n; i++) {
    if (!cleaned[i]) continue
    const x = i % w
    const y = Math.floor(i / w)

    // A. Explicit face boundary from face segmentation model
    if (faceBin && faceBin[i]) {
      cleaned[i] = 0
      continue
    }

    // B. Forehead & Cheek suppression
    const isSkin = rawSkin[i] || skinExpanded[i]
    if (isSkin) {
      const dSkin = skinRef ? dE(lab, i, skinRef) : 12
      const dHair = crownRef ? dE(lab, i, crownRef) : 35

      // Forehead / inner face zone: below top of face
      if (y > ftop + 0.08 * fheight && y < fchin) {
        if (dSkin < 22 || dSkin < dHair * 0.9) {
          cleaned[i] = 0
          continue
        }
      }

      // Neck & chest suppression: below chin
      if (y >= fchin - 0.05 * fheight && Math.abs(x - fcx) < 0.45 * fwidth) {
        if (dSkin < 25) {
          cleaned[i] = 0
          continue
        }
      }
    }
  }

  return cleaned
}

function detectFace(skinOpen: Uint8Array, w: number, h: number): FaceInfo | null {
  const { labels, sizes } = labelComponents(skinOpen, w, h)
  if (!sizes.length) return null

  // centroid per component
  const sumX = new Float64Array(sizes.length)
  const sumY = new Float64Array(sizes.length)
  for (let i = 0; i < w * h; i++) {
    const l = labels[i]
    if (l >= 0) { sumX[l] += i % w; sumY[l] += Math.floor(i / w) }
  }
  let best = -1
  let bestScore = 0
  for (let c = 0; c < sizes.length; c++) {
    if (sizes[c] < w * h * 0.008) continue
    const cx = sumX[c] / sizes[c]
    const cy = sumY[c] / sizes[c]
    if (cy > h * 0.8) continue
    const score = sizes[c] / (1 + (Math.abs(cx - w / 2) / w) * 2)
    if (score > bestScore) { bestScore = score; best = c }
  }
  if (best < 0) return null

  const rowMin = new Int32Array(h).fill(w)
  const rowMax = new Int32Array(h).fill(-1)
  let top = h
  let bottom = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (labels[y * w + x] === best) {
        if (x < rowMin[y]) rowMin[y] = x
        if (x > rowMax[y]) rowMax[y] = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }
  const widthAt = (y: number) => (rowMax[y] >= 0 ? rowMax[y] - rowMin[y] + 1 : 0)

  // widest point of the head, then first clear narrowing (neck) below it
  let maxW = 0
  let chinRow = bottom
  for (let y = top; y <= bottom; y++) {
    const wd = widthAt(y)
    if (wd > maxW) maxW = wd
    if (y - top > 0.6 * maxW && wd < 0.72 * maxW) { chinRow = y; break }
  }
  const faceW = maxW
  const faceH = Math.min(1.6 * faceW, Math.max(0.9 * faceW, chinRow - top))

  let cxs = 0
  let cn = 0
  for (let y = Math.round(top + 0.3 * faceH); y <= Math.round(top + 0.7 * faceH) && y <= bottom; y++) {
    if (rowMax[y] >= 0) { cxs += (rowMin[y] + rowMax[y]) / 2; cn++ }
  }
  const cx = cn ? cxs / cn : (rowMin[top] + rowMax[top]) / 2
  return { cx, top, width: faceW, height: faceH, chin: top + faceH }
}

function backgroundMask(lab: Float32Array, w: number, h: number) {
  const bg = new Uint8Array(w * h)
  const seeds: number[] = []
  for (let x = 0; x < w; x++) seeds.push(x)
  for (let y = 0; y < Math.floor(h * 0.7); y++) { seeds.push(y * w); seeds.push(y * w + w - 1) }
  const ref = [
    median(seeds.map(i => lab[i * 3])),
    median(seeds.map(i => lab[i * 3 + 1])),
    median(seeds.map(i => lab[i * 3 + 2]))
  ]
  const limitY = Math.floor(h * 0.85)
  const queue = new Int32Array(w * h)
  let head = 0
  let tail = 0
  for (const s of seeds) {
    if (!bg[s] && dE(lab, s, ref) < 22) { bg[s] = 1; queue[tail++] = s }
  }
  const tryPush = (p: number, q: number) => {
    if (bg[q]) return
    const d = dE(lab, q, ref)
    const dx = lab[q * 3] - lab[p * 3]
    const dy = lab[q * 3 + 1] - lab[p * 3 + 1]
    const dz = lab[q * 3 + 2] - lab[p * 3 + 2]
    const step = Math.sqrt(dx * dx + dy * dy + dz * dz)
    if (d < 20 || (step < 3.5 && d < 45)) { bg[q] = 1; queue[tail++] = q }
  }
  while (head < tail) {
    const p = queue[head++]
    const x = p % w
    const y = (p - x) / w
    if (x > 0) tryPush(p, p - 1)
    if (x < w - 1) tryPush(p, p + 1)
    if (y > 0) tryPush(p, p - w)
    if (y < limitY) tryPush(p, p + w)
  }
  return bg
}

/* ---------------- optional: Gemini segmentation mask ---------------- */

async function geminiHairMask(img: RawImage): Promise<Uint8Array | null> {
  const ai = getGenAIClient()
  if (!ai) return null
  const { width: w, height: h } = img
  try {
    const jpeg = await sharp(Buffer.from(img.data.buffer, img.data.byteOffset, img.data.byteLength), {
      raw: { width: w, height: h, channels: 3 }
    }).jpeg({ quality: 88 }).toBuffer()

    const call = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { mimeType: 'image/jpeg', data: jpeg.toString('base64') } },
        {
          text:
            'Give the segmentation mask for the hair on the head of the main person only. ' +
            'Do not include eyebrows, beard, skin, clothing or background. ' +
            'Output a JSON list where each entry contains the 2D bounding box in key "box_2d" ' +
            '([y0, x0, y1, x1] normalized 0-1000), the segmentation mask in key "mask", and the text label in key "label".'
        }
      ],
      config: { responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } }
    })
    const response: any = await Promise.race([
      call,
      new Promise((_, rej) => setTimeout(() => rej(new Error('gemini segmentation timeout')), 25000))
    ])

    const items = JSON.parse(String(response.text || '[]').replace(/```json|```/g, '').trim())
    if (!Array.isArray(items) || !items.length) return null

    const out = new Uint8Array(w * h)
    let painted = 0
    for (const it of items) {
      if (!it?.box_2d || !it?.mask) continue
      if (it.label && !/hair/i.test(String(it.label))) continue
      const [y0n, x0n, y1n, x1n] = it.box_2d as number[]
      const x0 = Math.max(0, Math.round((x0n / 1000) * w))
      const y0 = Math.max(0, Math.round((y0n / 1000) * h))
      const x1 = Math.min(w, Math.round((x1n / 1000) * w))
      const y1 = Math.min(h, Math.round((y1n / 1000) * h))
      const bw = x1 - x0
      const bh = y1 - y0
      if (bw < 4 || bh < 4) continue
      const png = Buffer.from(String(it.mask).replace(/^data:image\/png;base64,/, ''), 'base64')
      const grey = await sharp(png).greyscale().resize(bw, bh).raw().toBuffer()
      for (let j = 0; j < bh; j++) {
        for (let i = 0; i < bw; i++) {
          if (grey[j * bw + i] > 127) { out[(y0 + j) * w + x0 + i] = 1; painted++ }
        }
      }
    }
    return painted > w * h * 0.005 ? out : null
  } catch (err) {
    console.warn('[hair] Gemini segmentation unavailable, using local detector:', (err as Error).message)
    return null
  }
}

/* ---------------- main entry ---------------- */

async function segmentHairHeuristic(img: RawImage, lab: Float32Array): Promise<SegmentationResult> {
  const { width: w, height: h } = img
  const n = w * h
  const notes: string[] = []

  // 1. skin + face
  const skinRaw = skinMask(img)
  const skin = morph(morph(skinRaw, w, h, 1, false), w, h, 1, true)
  const face = detectFace(skin, w, h)
  if (!face) {
    throw createError({
      statusCode: 422,
      statusMessage: 'No face detected. Please use a clear, front-facing photo with the hair visible.'
    })
  }
  const skinWide = morph(skinRaw, w, h, 1, true)

  // 2. background
  const bg = backgroundMask(lab, w, h)

  // 3. reference color of the hair just above the forehead
  const crownPixels: number[] = []
  const cy0 = Math.max(0, Math.round(face.top - 0.3 * face.height))
  const cy1 = Math.max(cy0 + 1, Math.round(face.top + 0.02 * face.height))
  const cx0 = Math.max(0, Math.round(face.cx - 0.4 * face.width))
  const cx1 = Math.min(w - 1, Math.round(face.cx + 0.4 * face.width))
  for (let y = cy0; y < cy1; y++) {
    for (let x = cx0; x <= cx1; x++) {
      const i = y * w + x
      if (!bg[i] && !skinWide[i]) crownPixels.push(i)
    }
  }
  let crownRef: [number, number, number] | null = null
  if (crownPixels.length > 40) {
    crownRef = [
      median(crownPixels.map(i => lab[i * 3])),
      median(crownPixels.map(i => lab[i * 3 + 1])),
      median(crownPixels.map(i => lab[i * 3 + 2]))
    ]
  } else {
    notes.push('Little hair visible above the forehead; confidence is reduced.')
  }

  // 4. protection zones (face ellipse + neck) that can never be hair
  const ecx = face.cx
  const ecy = face.top + 0.62 * face.height
  const erx = 0.46 * face.width
  const ery = 0.52 * face.height
  const protectedZone = new Uint8Array(n)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ex = (x - ecx) / erx
      const ey = (y - ecy) / ery
      const inEllipse = ex * ex + ey * ey < 1
      const inNeck =
        Math.abs(x - face.cx) < 0.42 * face.width && y > face.chin - 0.08 * face.height && y < face.chin + 0.7 * face.height
      if (inEllipse || inNeck) protectedZone[y * w + x] = 1
    }
  }

  // 5. candidate hair pixels
  const geminiMask = await geminiHairMask(img)
  const method: SegmentationResult['method'] = geminiMask ? 'gemini_mask+skin_exclusion' : 'local_face_background_skin'
  const cand = new Uint8Array(n)
  const maxY = face.chin + 0.9 * face.height
  const halfX = 1.9 * face.width
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (protectedZone[i] || bg[i]) continue
      if (geminiMask) {
        if (!geminiMask[i]) continue
      } else {
        if (y > maxY || Math.abs(x - face.cx) > halfX) continue
      }
      const dRef = crownRef ? dE(lab, i, crownRef) : 0
      if (skinWide[i] && y > face.top + 0.1 * face.height) {
        // skin-like pixel: keep only if it is clearly hair-coloured (e.g. red/copper hair)
        if (!crownRef || dRef > 14) continue
      }
      if (!geminiMask && crownRef) {
        const below = y > face.chin - 0.05 * face.height
        if (dRef > (below ? 26 : 40)) continue
      }
      cand[i] = 1
    }
  }

  // 6. close small holes, keep the main connected hair region(s)
  const closed = morphClose(cand, w, h, 2)
  for (let i = 0; i < n; i++) if (protectedZone[i] || bg[i]) closed[i] = 0
  const { labels, sizes } = labelComponents(closed, w, h)
  if (!sizes.length) {
    throw createError({ statusCode: 422, statusMessage: 'Hair could not be detected in this photo.' })
  }
  const largest = Math.max(...sizes)
  const keep = sizes.map(s => s >= 0.08 * largest)
  let mask = new Uint8Array(n)
  let count = 0
  for (let i = 0; i < n; i++) {
    if (labels[i] >= 0 && keep[labels[i]]) { mask[i] = 1; count++ }
  }
  if (count < n * 0.004) {
    throw createError({ statusCode: 422, statusMessage: 'Hair could not be detected in this photo.' })
  }

  // Morphological opening to prune stray pixels & skin spill suppression
  mask = morphOpen(mask, w, h, 1)
  mask = suppressSkinSpill(mask, img, lab, face, null, crownRef)

  // 7. Gaussian blur edge feathering (2-5px radius) for smooth natural strand transitions
  const blurred = gaussianBlur(Float32Array.from(mask), w, h, 3)
  const alpha = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    if (protectedZone[i] || bg[i]) continue
    const t = Math.max(0, Math.min(1, (blurred[i] - 0.06) / 0.88))
    let aVal = t * t * (3 - 2 * t)
    if (skinWide[i]) aVal *= 0.65
    alpha[i] = Math.max(0, Math.min(1, aVal))
  }

  return { alpha, mask, face, crownRef, method, notes }
}

/* ---------------- primary: SegFormer hair segmentation model ---------------- */

const MODEL_ID = 'Xenova/segformer_b2_clothes' // ATR-style classes incl. Hair / Face / Hat
let segmenterPromise: Promise<any> | null = null

async function getSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers')
      const modelDir = process.env.HAIR_MODEL_DIR || join(process.cwd(), 'models')
      env.localModelPath = modelDir
      env.cacheDir = join(modelDir, '.download-cache')
      // fully offline when the model is bundled; auto-download only if it is missing
      env.allowRemoteModels = !existsSync(join(modelDir, MODEL_ID, 'onnx', 'model_quantized.onnx'))
      return pipeline('image-segmentation', MODEL_ID, { dtype: 'q8' })
    })().catch((err) => {
      segmenterPromise = null // allow retry on the next request
      throw err
    })
  }
  return segmenterPromise
}

function largestComponent(bin: Uint8Array, w: number, h: number, minRel = 0) {
  const { labels, sizes } = labelComponents(bin, w, h)
  if (!sizes.length) return { out: new Uint8Array(w * h), count: 0 }
  const largest = Math.max(...sizes)
  const keep = sizes.map(s => s >= Math.max(minRel * largest, 1))
  const out = new Uint8Array(w * h)
  let count = 0
  for (let i = 0; i < w * h; i++) {
    if (labels[i] >= 0 && keep[labels[i]]) { out[i] = 1; count++ }
  }
  return { out, count }
}

async function segmentHairModel(img: RawImage, lab: Float32Array): Promise<SegmentationResult> {
  const { width: w, height: h } = img
  const n = w * h
  const { RawImage: HfImage } = await import('@huggingface/transformers')
  const segmenter = await getSegmenter()
  const results: any[] = await segmenter(new HfImage(new Uint8ClampedArray(img.data), w, h, 3))

  const pick = (label: string) => results.find(r => String(r.label).toLowerCase() === label)
  const hairRes = pick('hair')
  const faceRes = pick('face')
  if (!hairRes || !faceRes) {
    throw createError({ statusCode: 422, statusMessage: 'No face or hair detected. Please use a clear, front-facing photo with the hair visible.' })
  }
  if (hairRes.mask.data.length !== n || faceRes.mask.data.length !== n) {
    throw new Error('segmentation mask size mismatch')
  }

  const hairBin = new Uint8Array(n)
  const faceBin = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    hairBin[i] = hairRes.mask.data[i] > 127 ? 1 : 0
    faceBin[i] = faceRes.mask.data[i] > 127 ? 1 : 0
  }

  // face geometry (used for hair length + protection)
  const faceMain = largestComponent(faceBin, w, h).out
  let fl = w, fr = 0, ft = h, fb = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (faceMain[y * w + x]) {
        if (x < fl) fl = x
        if (x > fr) fr = x
        if (y < ft) ft = y
        if (y > fb) fb = y
      }
    }
  }
  if (fr <= fl || fb <= ft) {
    throw createError({ statusCode: 422, statusMessage: 'No face detected. Please use a clear, front-facing photo.' })
  }
  const face: FaceInfo = { cx: (fl + fr) / 2, top: ft, width: fr - fl + 1, height: fb - ft + 1, chin: fb }

  // 1. Keep real hair regions only
  let { out: mask, count } = largestComponent(hairBin, w, h, 0.05)
  if (count < n * 0.004) {
    throw createError({ statusCode: 422, statusMessage: 'Hair could not be detected in this photo (hat, hood or very little hair visible).' })
  }

  // 2. Morphological opening: clean up stray floating pixels from clothes/neck
  mask = morphOpen(mask, w, h, 1)

  // 3. Reference colour: hair pixels in the upper part of the hair region
  let hairTop = h
  for (let i = 0; i < n; i++) if (mask[i]) { hairTop = Math.min(hairTop, Math.floor(i / w)); break }
  const crownLimit = hairTop + Math.round(0.25 * h)
  const crown: number[] = []
  for (let i = 0; i < n; i++) if (mask[i] && Math.floor(i / w) < crownLimit) crown.push(i)
  const crownRef: [number, number, number] | null = crown.length > 40
    ? [median(crown.map(i => lab[i * 3])), median(crown.map(i => lab[i * 3 + 1])), median(crown.map(i => lab[i * 3 + 2]))]
    : null

  // 4. Secondary skin-detection & spill suppression (forehead, temples, ears, neck)
  mask = suppressSkinSpill(mask, img, lab, face, faceBin, crownRef)

  // 5. Edge feathering with Gaussian blur (radius = 3 pixels for smooth 2-5px gradient)
  const blurred = gaussianBlur(Float32Array.from(mask), w, h, 3)

  // 6. Soft alpha gradient with cubic smoothstep transition
  const rawSkin = skinMask(img)
  const skinExpanded = morph(rawSkin, w, h, 2, true)
  const alpha = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    if (faceBin[i]) continue // face skin is strictly zero
    const t = Math.max(0, Math.min(1, (blurred[i] - 0.05) / 0.88))
    let aVal = t * t * (3 - 2 * t)

    // Attenuate hairline edge if adjacent to skin
    if (skinExpanded[i] && aVal > 0) {
      aVal *= 0.65
    }

    alpha[i] = Math.max(0, Math.min(1, aVal))
  }

  return { alpha, mask, face, crownRef, method: 'segformer_hair_model', notes: [] }
}

/** Reads the hair area: neural network first, colour/geometry heuristic as a safety net. */
export async function segmentHair(img: RawImage, lab: Float32Array): Promise<SegmentationResult> {
  try {
    return await segmentHairModel(img, lab)
  } catch (err: any) {
    if (err?.statusCode === 422) throw err // legitimate "no hair / no face" answer
    console.warn('[hair] segmentation model unavailable, using heuristic fallback:', err?.message || err)
    const res = await segmentHairHeuristic(img, lab)
    res.notes.push('Hair model was unavailable; used the lower-accuracy fallback detector.')
    return res
  }
}

export function computeLab(img: RawImage) {
  const n = img.width * img.height
  const lab = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    rgbToLab(img.data[i * 3], img.data[i * 3 + 1], img.data[i * 3 + 2], lab, i * 3)
  }
  return lab
}
