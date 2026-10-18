import type { RawImage } from './imageio'
import type { SegmentationResult } from './segment'
import { labChroma, labHue, labToRgb, levelFromL, LEVEL_NAMES, rgbToHex } from './lab'

export interface HairColorAnalysis {
  hex: string
  lab: [number, number, number]
  level: number // integer 1-10
  levelFloat: number
  levelName: string
  undertone: 'neutral' | 'red' | 'copper' | 'gold' | 'yellow' | 'cool'
  undertoneLabel: string
  chroma: number
  hue: number
  grayPercentage: number
}

export interface HairAreaInfo {
  pixelCount: number
  areaRatio: number
  bbox: { left: number; top: number; right: number; bottom: number }
  lengthClass: 'short' | 'medium' | 'long'
  confidence: number
}

const sortedPick = (arr: number[], p: number) => arr[Math.min(arr.length - 1, Math.max(0, Math.floor(arr.length * p)))]

export function analyzeHairArea(img: RawImage, seg: SegmentationResult): HairAreaInfo {
  const { width: w, height: h } = img
  let left = w, right = 0, top = h, bottom = 0, count = 0
  const rowCount = new Int32Array(h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (seg.mask[y * w + x]) {
        count++
        rowCount[y]++
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }
  // lowest row that still contains a meaningful amount of hair
  let hairBottom = top
  for (let y = h - 1; y >= top; y--) {
    if (rowCount[y] >= Math.max(3, w * 0.01)) { hairBottom = y; break }
  }
  const belowChin = (hairBottom - seg.face.chin) / seg.face.height
  const lengthClass: HairAreaInfo['lengthClass'] = belowChin < 0.1 ? 'short' : belowChin < 0.85 ? 'medium' : 'long'

  const areaRatio = count / (w * h)
  let confidence = 0.55
  if (areaRatio > 0.03 && areaRatio < 0.5) confidence += 0.15
  if (seg.crownRef) confidence += 0.15
  if (seg.method === 'segformer_hair_model') confidence += 0.2
  else if (seg.method === 'gemini_mask+skin_exclusion') confidence += 0.1
  return {
    pixelCount: count,
    areaRatio,
    bbox: { left, top, right, bottom: hairBottom },
    lengthClass,
    confidence: Math.min(0.97, confidence)
  }
}

/** Reads the CURRENT colour of the detected hair pixels only. */
export function analyzeHairColor(lab: Float32Array, seg: SegmentationResult): HairColorAnalysis {
  const Ls: number[] = []
  const idx: number[] = []
  for (let i = 0; i < seg.mask.length; i++) {
    if (seg.mask[i] && seg.alpha[i] > 0.6) { Ls.push(lab[i * 3]); idx.push(i) }
  }
  const sorted = [...Ls].sort((a, b) => a - b)
  // robust range: ignore deepest shadows and specular highlights
  const lo = sortedPick(sorted, 0.08)
  const hi = sortedPick(sorted, 0.92)

  let sL = 0, sA = 0, sB = 0, n = 0
  for (let k = 0; k < idx.length; k++) {
    const L = Ls[k]
    if (L < lo || L > hi) continue
    const i = idx[k]
    sL += L; sA += lab[i * 3 + 1]; sB += lab[i * 3 + 2]; n++
  }
  n = Math.max(1, n)
  const L = sL / n, a = sA / n, b = sB / n
  const chroma = labChroma(a, b)
  const hue = labHue(a, b)

  let undertone: HairColorAnalysis['undertone']
  let undertoneLabel: string
  if (chroma < 7) { undertone = 'neutral'; undertoneLabel = 'Neutral / Ash' }
  else if (hue < 20 || hue > 340) { undertone = 'red'; undertoneLabel = 'Red' }
  else if (hue < 48) { undertone = 'red'; undertoneLabel = 'Red-Orange' }
  else if (hue < 68) { undertone = 'copper'; undertoneLabel = 'Orange / Copper' }
  else if (hue < 88) { undertone = 'gold'; undertoneLabel = 'Gold' }
  else if (hue < 110) { undertone = 'yellow'; undertoneLabel = 'Yellow' }
  else { undertone = 'cool'; undertoneLabel = 'Cool / Green-Blue' }

  // grey/white strands: very light and unsaturated while the bulk of the hair is dark
  let gray = 0
  if (L < 50) {
    let g = 0
    for (let k = 0; k < idx.length; k++) {
      const i = idx[k]
      if (lab[i * 3] > L + 20 && labChroma(lab[i * 3 + 1], lab[i * 3 + 2]) < 9) g++
    }
    gray = Math.min(100, Math.round(((g / Math.max(1, idx.length)) * 100) / 5) * 5)
    if (gray < 5) gray = 0
  }

  const levelFloat = levelFromL(L)
  const level = Math.max(1, Math.min(10, Math.round(levelFloat)))
  const [r, g2, b2] = labToRgb(L, a, b)
  return {
    hex: rgbToHex(r, g2, b2),
    lab: [L, a, b],
    level,
    levelFloat,
    levelName: LEVEL_NAMES[level],
    undertone,
    undertoneLabel,
    chroma,
    hue,
    grayPercentage: gray
  }
}
