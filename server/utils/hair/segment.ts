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
  method: 'gemini_vision_polygon' | 'segformer_hair_model' | 'gemini_mask+skin_exclusion' | 'local_face_background_skin'
  notes: string[]
}

/* ---------------- low level morphological & filter helpers ---------------- */

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
 * Separable 2D Gaussian blur filter for smooth alpha mask edge feathering (2-3px radius).
 * Eliminates harsh jagged staircasing and creates natural hair-strand gradient falloffs.
 */
function gaussianBlur(src: Float32Array, w: number, h: number, r = 2.5): Float32Array {
  const intR = Math.max(1, Math.round(r))
  const sigma = Math.max(0.8, r / 2)
  const size = 2 * intR + 1
  const kernel = new Float32Array(size)
  let kSum = 0

  for (let i = -intR; i <= intR; i++) {
    const val = Math.exp(-(i * i) / (2 * sigma * sigma))
    kernel[i + intR] = val
    kSum += val
  }
  for (let i = 0; i < size; i++) {
    kernel[i] /= kSum
  }

  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)

  // Horizontal pass
  for (let y = 0; y < h; y++) {
    const yOffset = y * w
    for (let x = 0; x < w; x++) {
      let sum = 0
      for (let k = -intR; k <= intR; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k))
        sum += src[yOffset + xx] * kernel[k + intR]
      }
      tmp[yOffset + x] = sum
    }
  }

  // Vertical pass
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let sum = 0
      for (let k = -intR; k <= intR; k++) {
        const yy = Math.min(h - 1, Math.max(0, y + k))
        sum += tmp[yy * w + x] * kernel[k + intR]
      }
      out[y * w + x] = sum
    }
  }

  return out
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

function fallbackFace(w: number, h: number): FaceInfo {
  return {
    cx: w / 2,
    top: h * 0.22,
    width: w * 0.45,
    height: h * 0.42,
    chin: h * 0.64
  }
}

/**
 * Creates soft alpha mask strictly inside true hair follicles with:
 * 1. An absolute crown clamp: no color pixels ever render above the highest detected hair strand.
 * 2. Per-column hairline clamping so color never bleeds upwards onto the forehead skin.
 * 3. Smooth Gaussian feathering along hair edges without artificial forehead cuts.
 */
function createFollicleAlpha(
  mask: Uint8Array,
  w: number,
  h: number,
  blurRadius = 2.5
): Float32Array {
  const n = w * h
  let minHairY = h
  const colMinY = new Int32Array(w).fill(h)

  // Find topmost hair boundary globally and per column
  for (let y = 0; y < h; y++) {
    const rowOffset = y * w
    for (let x = 0; x < w; x++) {
      if (mask[rowOffset + x]) {
        if (y < minHairY) minHairY = y
        if (y < colMinY[x]) colMinY[x] = y
      }
    }
  }

  // Gaussian blur of the binary mask to generate smooth edge gradients
  const blurred = gaussianBlur(Float32Array.from(mask), w, h, blurRadius)
  const alpha = new Float32Array(n)

  for (let y = 0; y < h; y++) {
    const rowOffset = y * w
    for (let x = 0; x < w; x++) {
      const i = rowOffset + x
      // Absolute clamp: strictly zero out any pixel above the crown / hairline limit
      if (y < minHairY || y < colMinY[x] - 1) {
        alpha[i] = 0
        continue
      }

      const bVal = blurred[i]
      if (bVal < 0.04) {
        alpha[i] = 0
        continue
      }

      // Smooth Hermite curve for natural follicle edge falloff
      const t = Math.max(0, Math.min(1, (bVal - 0.04) / 0.88))
      alpha[i] = t * t * (3 - 2 * t)
    }
  }

  return alpha
}

function parsePoint(pt: any, w: number, h: number): [number, number] | null {
  if (Array.isArray(pt) && pt.length >= 2) {
    // Gemini vision coordinates are typically [y, x] normalized 0..1000
    const [y, x] = pt
    return [(x / 1000) * w, (y / 1000) * h]
  }
  if (pt && typeof pt === 'object' && 'x' in pt && 'y' in pt) {
    const x = pt.x <= 1 ? pt.x * w : (pt.x / 1000) * w
    const y = pt.y <= 1 ? pt.y * h : (pt.y / 1000) * h
    return [x, y]
  }
  return null
}

/* ---------------- 1. Gemini Structured Vision Segmentation ---------------- */

async function segmentHairGemini(img: RawImage, lab: Float32Array): Promise<SegmentationResult | null> {
  const ai = getGenAIClient()
  if (!ai) return null

  const { width: w, height: h } = img
  const n = w * h

  try {
    // Fast JPEG downscale for low network latency (< 1.5s)
    const jpeg = await sharp(Buffer.from(img.data.buffer, img.data.byteOffset, img.data.byteLength), {
      raw: { width: w, height: h, channels: 3 }
    })
      .resize(512, 512, { fit: 'inside' })
      .jpeg({ quality: 82 })
      .toBuffer()

    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest']
    let responseText: string | null = null

    for (const model of modelsToTry) {
      try {
        const call = ai.models.generateContent({
          model,
          contents: [
            { inlineData: { mimeType: 'image/jpeg', data: jpeg.toString('base64') } },
            {
              text:
                'You are an expert computer vision model specializing in portrait hair segmentation. ' +
                'Analyze the hair on the main person\'s head with high precision. ' +
                'Return a valid JSON object with: ' +
                '- "polygons": Array of polygon coordinate arrays [[y, x], ...] normalized from 0 to 1000. ' +
                'Each polygon precisely outlines the true hair volume and follicle roots along the natural hairline, crown, temples, and hair tips. ' +
                'Do NOT include forehead skin, eyebrows, eyes, ears, neck, or clothing. ' +
                '- "highest_hair_strand_y": Number 0-1000 representing the absolute highest hair strand at the crown. ' +
                '- "hairline_y": Number 0-1000 representing the forehead hairline level. ' +
                '- "face_bbox": [ymin, xmin, ymax, xmax] normalized 0-1000 of the face from forehead to chin.'
            }
          ],
          config: { responseMimeType: 'application/json' }
        })

        const res: any = await Promise.race([
          call,
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
        ])

        if (res.text) {
          responseText = res.text
          break
        }
      } catch {
        // try next model
      }
    }

    if (!responseText) return null

    const data = JSON.parse(responseText.replace(/```json|```/g, '').trim())
    const polygons = data.polygons || data.hair_polygons
    if (!Array.isArray(polygons) || !polygons.length) return null

    // Render SVG clipping path with Sharp for mathematically smooth continuous geometry
    const svgPolygons = polygons.map((poly: any) => {
      const points: string[] = []
      for (const pt of poly) {
        const p = parsePoint(pt, w, h)
        if (p) points.push(`${p[0].toFixed(1)},${p[1].toFixed(1)}`)
      }
      return `<polygon points="${points.join(' ')}" fill="#ffffff" />`
    }).join('\n')

    const svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${w}" height="${h}" fill="#000000" />
      ${svgPolygons}
    </svg>`

    const svgBuffer = await sharp(Buffer.from(svg))
      .resize(w, h)
      .greyscale()
      .raw()
      .toBuffer()

    const mask = new Uint8Array(n)
    let painted = 0
    for (let i = 0; i < n; i++) {
      if (svgBuffer[i] > 127) {
        mask[i] = 1
        painted++
      }
    }

    if (painted < n * 0.005) return null

    // Extract face info from face_bbox
    let face: FaceInfo
    if (Array.isArray(data.face_bbox) && data.face_bbox.length === 4) {
      const [ymin, xmin, ymax, xmax] = data.face_bbox
      const top = (ymin / 1000) * h
      const chin = (ymax / 1000) * h
      const left = (xmin / 1000) * w
      const right = (xmax / 1000) * w
      face = {
        cx: (left + right) / 2,
        top,
        width: Math.max(10, right - left),
        height: Math.max(10, chin - top),
        chin
      }
    } else {
      face = fallbackFace(w, h)
    }

    // Crown reference color for accurate baseline reading
    let minHairY = h
    for (let i = 0; i < n; i++) if (mask[i]) { minHairY = Math.min(minHairY, Math.floor(i / w)); break }
    const crownLimit = minHairY + Math.round(0.22 * h)
    const crown: number[] = []
    for (let i = 0; i < n; i++) if (mask[i] && Math.floor(i / w) < crownLimit) crown.push(i)
    const crownRef: [number, number, number] | null = crown.length > 30
      ? [median(crown.map(i => lab[i * 3])), median(crown.map(i => lab[i * 3 + 1])), median(crown.map(i => lab[i * 3 + 2]))]
      : null

    const alpha = createFollicleAlpha(mask, w, h, 2.5)

    return {
      alpha,
      mask,
      face,
      crownRef,
      method: 'gemini_vision_polygon',
      notes: []
    }
  } catch (err) {
    console.warn('[hair] Gemini vision polygon failed:', (err as Error).message)
    return null
  }
}

/* ---------------- 2. SegFormer Neural Model (Offline / Fast) ---------------- */

const MODEL_ID = 'Xenova/segformer_b2_clothes'
let segmenterPromise: Promise<any> | null = null

async function getSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers')
      const modelDir = process.env.HAIR_MODEL_DIR || join(process.cwd(), 'models')
      env.localModelPath = modelDir
      env.cacheDir = join(modelDir, '.download-cache')
      env.allowRemoteModels = !existsSync(join(modelDir, MODEL_ID, 'onnx', 'model_quantized.onnx'))
      return pipeline('image-segmentation', MODEL_ID, { dtype: 'q8' })
    })().catch((err) => {
      segmenterPromise = null
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

  if (!hairRes) {
    throw createError({ statusCode: 422, statusMessage: 'No hair detected. Please use a clear, front-facing photo with the hair visible.' })
  }
  if (hairRes.mask.data.length !== n) {
    throw new Error('segmentation mask size mismatch')
  }

  const hairBin = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    hairBin[i] = hairRes.mask.data[i] > 127 ? 1 : 0
  }

  // Face geometry
  let face: FaceInfo
  if (faceRes && faceRes.mask.data.length === n) {
    const faceBin = new Uint8Array(n)
    for (let i = 0; i < n; i++) faceBin[i] = faceRes.mask.data[i] > 127 ? 1 : 0
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
    if (fr > fl && fb > ft) {
      face = { cx: (fl + fr) / 2, top: ft, width: fr - fl + 1, height: fb - ft + 1, chin: fb }
    } else {
      face = fallbackFace(w, h)
    }
  } else {
    face = fallbackFace(w, h)
  }

  // Keep genuine hair regions
  let { out: mask, count } = largestComponent(hairBin, w, h, 0.05)
  if (count < n * 0.004) {
    throw createError({ statusCode: 422, statusMessage: 'Hair could not be detected in this photo (hat, hood or very little hair visible).' })
  }

  // Clean micro noise
  mask = morphOpen(mask, w, h, 1)

  // Protect ONLY the inner facial feature core (eyes, nose, mouth) — NEVER the forehead hairline roots!
  // Inner face core: below eyes to above chin, centered between cheeks
  const eyeLine = face.top + 0.38 * face.height
  const mouthLine = face.chin - 0.12 * face.height
  const innerHalfW = 0.28 * face.width
  for (let y = Math.floor(eyeLine); y < Math.floor(mouthLine); y++) {
    for (let x = Math.floor(face.cx - innerHalfW); x <= Math.floor(face.cx + innerHalfW); x++) {
      if (x >= 0 && x < w && y >= 0 && y < h) {
        mask[y * w + x] = 0
      }
    }
  }

  // Crown reference color for accurate baseline reading
  let minHairY = h
  for (let i = 0; i < n; i++) if (mask[i]) { minHairY = Math.min(minHairY, Math.floor(i / w)); break }
  const crownLimit = minHairY + Math.round(0.22 * h)
  const crown: number[] = []
  for (let i = 0; i < n; i++) if (mask[i] && Math.floor(i / w) < crownLimit) crown.push(i)
  const crownRef: [number, number, number] | null = crown.length > 30
    ? [median(crown.map(i => lab[i * 3])), median(crown.map(i => lab[i * 3 + 1])), median(crown.map(i => lab[i * 3 + 2]))]
    : null

  // Soft alpha with absolute crown clamp and per-column hairline clamp
  const alpha = createFollicleAlpha(mask, w, h, 2.5)

  return { alpha, mask, face, crownRef, method: 'segformer_hair_model', notes: [] }
}

/* ---------------- 3. Algorithmic Fallback (No Rigid Forehead Cut) ---------------- */

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

async function segmentHairHeuristic(img: RawImage, lab: Float32Array): Promise<SegmentationResult> {
  const { width: w, height: h } = img
  const n = w * h
  const face = fallbackFace(w, h)
  const bg = backgroundMask(lab, w, h)

  // Reference hair color sampled around the crown
  const crownPixels: number[] = []
  const cy0 = Math.max(0, Math.round(face.top - 0.25 * face.height))
  const cy1 = Math.max(cy0 + 1, Math.round(face.top + 0.05 * face.height))
  const cx0 = Math.max(0, Math.round(face.cx - 0.38 * face.width))
  const cx1 = Math.min(w - 1, Math.round(face.cx + 0.38 * face.width))
  for (let y = cy0; y < cy1; y++) {
    for (let x = cx0; x <= cx1; x++) {
      const i = y * w + x
      if (!bg[i]) crownPixels.push(i)
    }
  }

  const crownRef: [number, number, number] | null = crownPixels.length > 25
    ? [median(crownPixels.map(i => lab[i * 3])), median(crownPixels.map(i => lab[i * 3 + 1])), median(crownPixels.map(i => lab[i * 3 + 2]))]
    : null

  // Candidate pixels: NO rigid forehead ellipse cuts.
  // Only exclude inner facial core (eyes/nose/mouth)
  const eyeLine = face.top + 0.38 * face.height
  const mouthLine = face.chin - 0.12 * face.height
  const innerHalfW = 0.28 * face.width
  const cand = new Uint8Array(n)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (bg[i]) continue
      // Inner face core exclusion
      if (y >= eyeLine && y <= mouthLine && Math.abs(x - face.cx) <= innerHalfW) continue

      if (crownRef) {
        const dRef = dE(lab, i, crownRef)
        if (dRef > 42) continue
      }
      cand[i] = 1
    }
  }

  const closed = morphClose(cand, w, h, 2)
  const { out: mask, count } = largestComponent(closed, w, h, 0.08)
  if (count < n * 0.004) {
    throw createError({ statusCode: 422, statusMessage: 'Hair could not be detected in this photo.' })
  }

  const alpha = createFollicleAlpha(mask, w, h, 2.5)
  return { alpha, mask, face, crownRef, method: 'local_face_background_skin', notes: ['Used heuristic fallback.'] }
}

/* ---------------- Main Unified Entry Point ---------------- */

export async function segmentHair(img: RawImage, lab: Float32Array): Promise<SegmentationResult> {
  // 1. Try Gemini Structured Vision Polygon if API key is configured
  const ai = getGenAIClient()
  if (ai) {
    try {
      const geminiRes = await segmentHairGemini(img, lab)
      if (geminiRes) return geminiRes
    } catch (err: any) {
      console.warn('[hair] Gemini vision polygon failed, falling back to neural model:', err?.message || err)
    }
  }

  // 2. High-speed local neural model (SegFormer clothes/hair) with zero hairline clipping
  try {
    return await segmentHairModel(img, lab)
  } catch (err: any) {
    if (err?.statusCode === 422) throw err
    console.warn('[hair] SegFormer model unavailable, using heuristic fallback:', err?.message || err)
    return await segmentHairHeuristic(img, lab)
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
