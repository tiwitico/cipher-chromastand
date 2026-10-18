import { createHash } from 'node:crypto'
import { decodeDataUrl, encodeJpegDataUrl, type RawImage } from './imageio'
import { computeLab, segmentHair, type SegmentationResult } from './segment'
import { analyzeHairArea, analyzeHairColor, type HairAreaInfo, type HairColorAnalysis } from './analysis'
import { hairOverlay, recolorHair, type RecolorParams } from './recolor'
import { calculateColorFormula } from '../hairChemistry'

interface CachedRead {
  img: RawImage
  lab: Float32Array
  seg: SegmentationResult
  area: HairAreaInfo
  color: HairColorAnalysis
  overlay: string
}

// Reading the photo (segmentation + colour) is the expensive part; cache it per image
// so live colour changes only re-run the cheap recolor + chemistry stages.
const CACHE = new Map<string, CachedRead>()
const CACHE_MAX = 8

async function readPhoto(image: string): Promise<CachedRead> {
  const key = createHash('sha1').update(image).digest('hex')
  const hit = CACHE.get(key)
  if (hit) {
    CACHE.delete(key)
    CACHE.set(key, hit)
    return hit
  }
  const img = await decodeDataUrl(image, 768)
  const lab = computeLab(img)
  const seg = await segmentHair(img, lab) // 1. hair area only
  const area = analyzeHairArea(img, seg)
  const color = analyzeHairColor(lab, seg) // 2. current hair colour
  const overlay = await encodeJpegDataUrl(hairOverlay(img, seg.alpha), img.width, img.height, 80)
  const entry: CachedRead = { img, lab, seg, area, color, overlay }
  CACHE.set(key, entry)
  if (CACHE.size > CACHE_MAX) CACHE.delete(CACHE.keys().next().value as string)
  return entry
}

export interface ProcessInput extends RecolorParams {
  image: string
  colorFamily?: string
  colorName?: string
  /** optional manual override of the detected level (1-10) */
  currentLevelOverride?: number
}

export async function processHairPhoto(input: ProcessInput) {
  const read = await readPhoto(input.image)
  const { img, lab, seg, area, color } = read

  const currentLevel = input.currentLevelOverride ?? color.level

  // 3 + 4. bleach feasibility and material calculation, driven by what was read from the photo
  const formula = calculateColorFormula({
    currentLevel,
    currentUndertone: color.undertone,
    targetHex: input.targetHex,
    colorName: input.colorName,
    colorFamily: input.colorFamily,
    grayPercentage: color.grayPercentage,
    hairLength: area.lengthClass,
    hairAreaRatio: area.areaRatio
  })

  // 5. recolor only the hair that was read
  const recolored = recolorHair(img, lab, seg.alpha, color, area, input)
  const resultImage = await encodeJpegDataUrl(recolored, img.width, img.height, 92)

  const warnings = [...seg.notes]
  if (area.confidence < 0.7) warnings.push('Hair detection confidence is moderate. A bright, front-facing photo gives the best result.')
  if (formula.needsBleach) warnings.push('Preview shows the final shade after bleaching and toning.')

  return {
    width: img.width,
    height: img.height,
    method: seg.method,
    hair: {
      areaPercent: Math.round(area.areaRatio * 1000) / 10,
      pixelCount: area.pixelCount,
      bbox: area.bbox,
      lengthClass: area.lengthClass,
      confidence: Math.round(area.confidence * 100) / 100,
      overlayImage: read.overlay
    },
    currentColor: {
      hex: color.hex,
      level: color.level,
      levelName: color.levelName,
      undertone: color.undertoneLabel,
      grayPercentage: color.grayPercentage,
      lab: color.lab.map(v => Math.round(v * 10) / 10)
    },
    feasibility: formula.feasibility,
    formula,
    resultImage,
    warnings
  }
}
