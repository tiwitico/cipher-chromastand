import type { RawImage } from './imageio'
import { hexToLab, labToRgb, hexToRgb } from './lab'
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
 * W3C standard Soft Light blend mode for natural highlights and lighting preservation.
 */
function softLightChannel(D: number, S: number): number {
  if (S <= 0.5) {
    return D - (1 - 2 * S) * D * (1 - D)
  }
  const g = D > 0.25 ? Math.sqrt(D) : ((16 * D - 12) * D + 4) * D
  return D + (2 * S - 1) * (g - D)
}

/**
 * Recolors ONLY pixels inside the detected hair alpha with salon-grade photorealism:
 * 1. CIELAB Luminance (L*) and shadow detail preservation: original strand textures,
 *    highlights, and root shadows remain visible underneath the new color.
 * 2. Multiply & Soft Light optical blend modes for true-to-life pigment absorption.
 * 3. Opacity tuning based on strand depth so hair never looks like flat solid paint.
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
  const out = new Uint8Array(img.data) // copy: untouched pixels remain 100% original
  const tgtLab = hexToLab(p.targetHex)
  const secLab = hexToLab(p.secondaryHex || p.targetHex)
  const tgtRgb = hexToRgb(p.targetHex)
  const secRgb = hexToRgb(p.secondaryHex || p.targetHex)

  const type = p.colorType || 'solid'
  const gloss = (p.gloss ?? 75) / 100
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
      if (al < 0.01) continue

      // 1. Technique spatial tone mixing (Balayage, Ombre, Highlights)
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

      // Target Lab coordinates and normalized dye RGB
      let tL = tgtLab[0] + (secLab[0] - tgtLab[0]) * mix
      const tA = tgtLab[1] + (secLab[1] - tgtLab[1]) * mix
      const tB = tgtLab[2] + (secLab[2] - tgtLab[2]) * mix

      const dyeR = (tgtRgb[0] + (secRgb[0] - tgtRgb[0]) * mix) / 255
      const dyeG = (tgtRgb[1] + (secRgb[1] - tgtRgb[1]) * mix) / 255
      const dyeB = (tgtRgb[2] + (secRgb[2] - tgtRgb[2]) * mix) / 255

      // Natural shadow root depth modulation
      const rootF = rootDark * (1 - smooth(0, 0.22, t))
      tL *= 1 - 0.55 * rootF

      // 2. Underlying physical pixel luminance & texture retention
      const origL = lab[i * 3]
      const origA = lab[i * 3 + 1]
      const origB = lab[i * 3 + 2]

      // Local fiber contrast ratio
      const ratio = Math.max(0.25, Math.min(2.5, Math.max(origL, 1) / srcL))

      // Calculate target luminance with fiber texture preservation
      const deltaL = tL - srcL
      const liftFactor = deltaL >= 0 ? 0.70 : 0.60
      let nL = origL + deltaL * liftFactor * (0.7 + 0.3 * Math.min(ratio, 1.4))

      // Specular highlight boost: retain natural fiber reflections
      if (ratio > 1.12) {
        nL += gloss * 14 * (ratio - 1.12)
      }
      nL = Math.max(2, Math.min(98, nL))

      // Chromaticity interpolation (substitute target tone while keeping subtle natural undertone)
      const nA = tA + (origA - srcA) * 0.15
      const nB = tB + (origB - srcB) * 0.15

      // Convert modulated CIELAB to RGB
      const [rLab, gLab, bLab] = labToRgb(nL, nA, nB)

      // 3. Optical blend modes: Multiply & Soft Light
      const o = i * 3
      const pixelR = out[o] / 255
      const pixelG = out[o + 1] / 255
      const pixelB = out[o + 2] / 255

      // Soft Light (maintains highlights and texture gradients)
      const softR = softLightChannel(pixelR, dyeR) * 255
      const softG = softLightChannel(pixelG, dyeG) * 255
      const softB = softLightChannel(pixelB, dyeB) * 255

      // Multiply (subtractive pigment absorption for deep, rich tones)
      const multR = pixelR * dyeR * 255
      const multG = pixelG * dyeG * 255
      const multB = pixelB * dyeB * 255

      // Blend mode selection: if lifting to lighter levels, prioritize Soft Light + Lab;
      // if depositing darker tones, fuse Multiply + Lab.
      const isLifting = deltaL > 5
      const blendR = isLifting ? 0.45 * softR + 0.55 * rLab : 0.45 * multR + 0.55 * rLab
      const blendG = isLifting ? 0.45 * softG + 0.55 * gLab : 0.45 * multG + 0.55 * gLab
      const blendB = isLifting ? 0.45 * softB + 0.55 * bLab : 0.45 * multB + 0.55 * bLab

      // 4. Opacity tuning based on strand depth
      // Roots and deep shadows receive subtle attenuation so they never appear artificially fluorescent
      const depthMod = 0.85 + 0.15 * Math.min(1, origL / 25)
      const effectiveAlpha = Math.max(0, Math.min(1, al * depthMod))

      out[o] = Math.round(out[o] + (blendR - out[o]) * effectiveAlpha)
      out[o + 1] = Math.round(out[o + 1] + (blendG - out[o + 1]) * effectiveAlpha)
      out[o + 2] = Math.round(out[o + 2] + (blendB - out[o + 2]) * effectiveAlpha)
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
