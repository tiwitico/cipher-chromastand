// Shared color science for the hair pipeline (sRGB <-> CIE L*a*b*, D65).

const LIN = new Float32Array(256)
for (let i = 0; i < 256; i++) {
  const c = i / 255
  LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)
const finv = (t: number) => {
  const t3 = t * t * t
  return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787
}

export function rgbToLab(r: number, g: number, b: number, out: Float32Array | number[], o = 0) {
  const R = LIN[r], G = LIN[g], B = LIN[b]
  const x = (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047
  const y = 0.2126729 * R + 0.7151522 * G + 0.072175 * B
  const z = (0.0193339 * R + 0.119192 * G + 0.9503041 * B) / 1.08883
  const fx = f(x), fy = f(y), fz = f(z)
  out[o] = 116 * fy - 16
  out[o + 1] = 500 * (fx - fy)
  out[o + 2] = 200 * (fy - fz)
}

const gamma = (c: number) => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
  return Math.max(0, Math.min(255, Math.round(v * 255)))
}

export function labToRgb(L: number, a: number, b: number): [number, number, number] {
  const fy = (L + 16) / 116
  const fx = fy + a / 500
  const fz = fy - b / 200
  const x = finv(fx) * 0.95047
  const y = finv(fy)
  const z = finv(fz) * 1.08883
  const R = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z
  const G = -0.969266 * x + 1.8760108 * y + 0.041556 * z
  const B = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z
  return [gamma(R), gamma(G), gamma(B)]
}

export function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '')
  return [parseInt(c.slice(0, 2), 16) || 0, parseInt(c.slice(2, 4), 16) || 0, parseInt(c.slice(4, 6), 16) || 0]
}

export function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

export function hexToLab(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex)
  const out: number[] = [0, 0, 0]
  rgbToLab(r, g, b, out)
  return out as [number, number, number]
}

/** Lab hue angle in degrees [0, 360): red~40, orange~60, yellow~90, green~140, blue~270, violet~315 */
export function labHue(a: number, b: number) {
  return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360
}

export function labChroma(a: number, b: number) {
  return Math.hypot(a, b)
}

/**
 * Maps lightness (L*) to the professional 1-10 hair level scale (1 = black, 10 = lightest blonde).
 * Piecewise-linear over calibrated anchors (screen L* of typical hair at each level).
 * Used for BOTH the photographed hair and the target swatch so lift is measured on one scale.
 */
const LEVEL_ANCHORS: [number, number][] = [
  [6, 1], [12, 2], [19, 3], [27, 4], [37, 5], [47, 6], [57, 7], [67, 8], [78, 9], [90, 10]
]
export function levelFromL(L: number) {
  if (L <= LEVEL_ANCHORS[0][0]) return 1
  for (let i = 1; i < LEVEL_ANCHORS.length; i++) {
    const [l1, v1] = LEVEL_ANCHORS[i]
    if (L <= l1) {
      const [l0, v0] = LEVEL_ANCHORS[i - 1]
      return v0 + ((L - l0) / (l1 - l0)) * (v1 - v0)
    }
  }
  return 10
}

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Black',
  2: 'Darkest Brown',
  3: 'Dark Brown',
  4: 'Medium Brown',
  5: 'Light Brown',
  6: 'Dark Blonde',
  7: 'Medium Blonde',
  8: 'Light Blonde',
  9: 'Very Light Blonde',
  10: 'Lightest Blonde'
}
