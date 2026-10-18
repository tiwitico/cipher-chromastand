import type { RawImage } from './imageio'
import { hexToLab, labToRgb } from './lab'
import type { HairAreaInfo, HairColorAnalysis } from './analysis'

export interface RecolorParams {
  targetHex: string
  secondaryHex?: string
  colorType?: 'solid' | 'balayage' | 'ombre' | 'highlights'
  gloss?: number // 0-100
  rootDarkness?: number // 0-100
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * Recolors ONLY pixels inside the detected hair alpha. Lightness detail (strands, shadows, highlights)
 * of the original hair is preserved while the colour is moved to the target in Lab space.
 * Pixels with alpha 0 are copied byte-for-byte from the original photo.
 */
export function recolorHair(
  img: RawImage,
  lab: Float32Array,
  alpha: Float32Array,
  current: HairColorAnalysis,
  area: HairAreaInfo,
  p: RecolorParams
): Uint8Array {
  const { width: w, height: h } = img
  const out = new Uint8Array(img.data) // copy: everything outside hair stays untouched
  const tgt = hexToLab(p.targetHex)
  const sec = hexToLab(p.secondaryHex || p.targetHex)
  const type = p.colorType || 'solid'
  const gloss = (p.gloss ?? 70) / 100
  const rootDark = (p.rootDarkness ?? 25) / 100
  const srcL = Math.max(8, current.lab[0])
  const srcA = current.lab[1]
  const srcB = current.lab[2]
  const top = area.bbox.top
  const span = Math.max(1, area.bbox.bottom - area.bbox.top)

  for (let y = 0; y < h; y++) {
    const t = Math.max(0, Math.min(1, (y - top) / span))
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      const al = alpha[i]
      if (al < 0.004) continue

      // choose tone (primary/secondary) for this position
      let mix = 0
      if (type === 'ombre') {
        mix = smooth(0.35, 0.8, t)
      } else if (type === 'balayage') {
        const streak = 0.5 + 0.5 * Math.sin(x * 0.09 + Math.sin(y * 0.025) * 2.5)
        mix = smooth(0.3, 0.85, t) * (0.55 + 0.45 * streak)
      } else if (type === 'highlights') {
        const s = Math.sin(x * 0.22 + Math.sin(y * 0.02) * 3.5)
        mix = t > 0.08 && s > 0.55 ? 0.85 * smooth(0.55, 0.9, s) : 0
      }
      let tL = tgt[0] + (sec[0] - tgt[0]) * mix
      const tA = tgt[1] + (sec[1] - tgt[1]) * mix
      const tB = tgt[2] + (sec[2] - tgt[2]) * mix

      // shadow root
      const rootF = rootDark * (1 - smooth(0, 0.22, t))
      tL *= 1 - 0.55 * rootF

      const L = lab[i * 3]
      const a = lab[i * 3 + 1]
      const b = lab[i * 3 + 2]
      // relative brightness of this pixel vs the average hair (strands, shadows, highlights)
      const ratio = Math.max(0.35, Math.min(2.2, Math.max(L, 1) / srcL))
      let nL = tL * Math.pow(ratio, 0.6)
      if (ratio > 1.15) nL += gloss * 10 * (ratio - 1.15) // keep specular shine
      nL = Math.max(0, Math.min(100, nL))
      const nA = tA + (a - srcA) * 0.2
      const nB = tB + (b - srcB) * 0.2

      const [r, g, bl] = labToRgb(nL, nA, nB)
      const o = i * 3
      out[o] = Math.round(out[o] + (r - out[o]) * al)
      out[o + 1] = Math.round(out[o + 1] + (g - out[o + 1]) * al)
      out[o + 2] = Math.round(out[o + 2] + (bl - out[o + 2]) * al)
    }
  }
  return out
}

/** Original photo with the detected hair area tinted, so the user can verify what was read. */
export function hairOverlay(img: RawImage, alpha: Float32Array): Uint8Array {
  const out = new Uint8Array(img.data)
  for (let i = 0; i < alpha.length; i++) {
    const al = alpha[i] * 0.5
    if (al < 0.01) continue
    const o = i * 3
    out[o] = Math.round(out[o] + (255 - out[o]) * al)
    out[o + 1] = Math.round(out[o + 1] + (40 - out[o + 1]) * al)
    out[o + 2] = Math.round(out[o + 2] + (140 - out[o + 2]) * al)
  }
  return out
}
