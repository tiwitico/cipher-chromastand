// Professional hair colour chemistry: feasibility (bleach or not), sessions and material quantities.
import { hexToLab, labChroma, labHue, levelFromL } from './hair/lab'

export interface HairChemistryInput {
  currentLevel?: number // measured from the photo (1-10)
  startingLevel?: number // legacy alias
  currentUndertone?: string
  targetHex: string
  colorName?: string
  colorFamily?: string
  grayPercentage?: number
  hairLength?: 'short' | 'medium' | 'long'
  hairAreaRatio?: number
}

export interface SubstanceComponent {
  name: string
  type: 'base_dye' | 'reflect_dye' | 'toner' | 'booster' | 'developer' | 'additive' | 'bleach' | 'base'
  code: string
  amountGrams: number
  description: string
  colorPreview?: string
}

export interface Feasibility {
  status: 'deposit_only' | 'direct' | 'bleach_required' | 'multi_session' | 'not_recommended'
  possible: boolean
  needsBleach: boolean
  sessions: number
  liftLevels: number
  requiredCanvasLevel: number
  headline: string
  reasons: string[]
  recommendation: string
}

export interface FormulationResult {
  currentLevel: number
  targetLevel: number
  undertoneAtTarget: string
  liftRequired: number
  needsBleach: boolean
  feasibility: Feasibility
  toneDescription: string
  bleachRecipe?: {
    powderGrams: number
    developerVolume: number
    developerGrams: number
    additive: string
    processingTimeMinutes: number
    notes: string
  }
  colorMixture: {
    mode: 'permanent' | 'demi_toner' | 'direct_dye'
    totalProductGrams: number
    developerVolume: number
    mixingRatio: string
    developerGrams: number
    components: SubstanceComponent[]
  }
  glossToner?: {
    required: boolean
    formula: string
    developerVolume: number
    developerGrams: number
    processingMinutes: number
  }
  applicationSteps: { step: number; phase: string; instruction: string; timeMinutes?: number }[]
  salonCareNotes: string[]
  pantoneHex: string
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/** Warmth that is exposed on bleached hair at each level (what a toner must neutralise). */
const EXPOSED: Record<number, { name: string; neutraliser: string }> = {
  1: { name: 'Red-Black', neutraliser: 'Green' },
  2: { name: 'Dark Red-Brown', neutraliser: 'Green' },
  3: { name: 'Deep Red', neutraliser: 'Green' },
  4: { name: 'Red', neutraliser: 'Green-Blue' },
  5: { name: 'Red-Orange', neutraliser: 'Blue-Green' },
  6: { name: 'Orange', neutraliser: 'Blue' },
  7: { name: 'Yellow-Orange', neutraliser: 'Blue-Violet' },
  8: { name: 'Yellow', neutraliser: 'Violet' },
  9: { name: 'Pale Yellow', neutraliser: 'Violet' },
  10: { name: 'Ultra Pale Yellow', neutraliser: 'Violet' }
}

interface Tone { code: string; name: string; cool: boolean }

function toneForTarget(hue: number, chroma: number, L: number): Tone {
  if (chroma < 8) return L > 65 ? { code: '1', name: 'Ash / Silver', cool: true } : { code: '0', name: 'Natural', cool: false }
  if (hue < 25 || hue > 335) return chroma < 16 ? { code: '0', name: 'Natural', cool: false } : { code: '6', name: 'Red / Magenta', cool: false }
  if (hue < 45) return chroma < 16 ? { code: '0', name: 'Natural', cool: false } : chroma < 30 ? { code: '5', name: 'Mahogany Brown', cool: false } : { code: '66', name: 'Intense Red', cool: false }
  if (hue < 62) {
    if (chroma < 16) return { code: '0', name: 'Natural Brown', cool: false }
    if (chroma < 28) return { code: '34', name: 'Warm Copper-Gold', cool: false }
    return { code: '4', name: 'Copper', cool: false }
  }
  if (hue < 90) return chroma < 22 ? { code: '13', name: 'Beige / Ash-Gold', cool: false } : { code: '3', name: 'Gold', cool: false }
  if (hue < 120) return { code: '3', name: 'Gold / Yellow', cool: false }
  if (hue < 200) return { code: '7', name: 'Green', cool: true }
  if (hue < 290) return { code: '8', name: 'Blue', cool: true }
  return { code: '2', name: 'Violet', cool: true }
}

export function calculateColorFormula(input: HairChemistryInput): FormulationResult {
  const currentLevel = clamp(Math.round(input.currentLevel ?? input.startingLevel ?? 4), 1, 10)
  const tLab = hexToLab(input.targetHex)
  const chroma = labChroma(tLab[1], tLab[2])
  const hue = labHue(tLab[1], tLab[2])
  const targetLevel = clamp(Math.round(levelFromL(tLab[0])), 1, 10)
  const gray = clamp(input.grayPercentage ?? 0, 0, 100)
  const length = input.hairLength || 'medium'
  const tone = toneForTarget(hue, chroma, tLab[0])

  const isFashion = input.colorFamily === 'fashion' || (chroma > 38 && !(hue >= 25 && hue <= 100))
  const isPastel = isFashion && tLab[0] > 62
  const lift = targetLevel - currentLevel

  // ---- feasibility: do we need bleach? ----
  const requiredCanvas = isFashion ? (isPastel ? 9 : tLab[0] >= 40 ? 7 : 4) : targetLevel
  const needsBleach = isFashion ? currentLevel < requiredCanvas : lift > 3
  const canvasLevel = needsBleach ? clamp(requiredCanvas, currentLevel + 1, 10) : currentLevel
  const bleachLift = needsBleach ? canvasLevel - currentLevel : 0
  const sessions = needsBleach ? Math.max(1, Math.ceil(bleachLift / 5)) : 1

  const reasons: string[] = []
  let status: Feasibility['status']
  let headline: string
  let recommendation: string
  if (needsBleach) {
    reasons.push(`Photo hair is Level ${currentLevel}; target needs a Level ${canvasLevel} canvas (${bleachLift} levels of lift).`)
    reasons.push('Permanent colour lifts at most ~3 levels; more lift requires bleach (decolorising) first.')
    if (isFashion) reasons.push(isPastel ? 'Pastel/fashion shades only show on Level 9-10 hair.' : 'Vivid fashion shades need a light base to show true colour.')
    if (sessions >= 3) {
      status = 'not_recommended'; headline = 'Not recommended in one go'
      recommendation = `This needs about ${sessions} bleach sessions. Consider a darker or warmer target to protect hair integrity.`
    } else if (sessions === 2) {
      status = 'multi_session'; headline = 'Possible - needs 2 sessions'
      recommendation = 'Bleach in two sessions 2-4 weeks apart with a bond builder, then tone to the target shade.'
    } else {
      status = 'bleach_required'; headline = 'Possible - bleach required'
      recommendation = 'Bleach to the required canvas in one session, then apply the target shade as a toner/colour.'
    }
  } else if (lift <= 0) {
    status = 'deposit_only'; headline = 'Possible - deposit only (no bleach)'
    reasons.push(lift === 0 ? 'Target depth matches your current level; only tone changes.' : `Target is ${-lift} level(s) darker; colour is deposited, no lifting needed.`)
    recommendation = 'Single-process colour at 10 Vol (20 Vol when grey coverage is needed).'
    if (lift <= -4 && (tone.code === '6' || tone.code === '66' || tone.code === '4' || tone.code === '3')) {
      reasons.push('Large darkening with a warm tone: pre-pigmenting (fill) prevents a muddy or ashy result.')
    }
  } else {
    status = 'direct'; headline = 'Possible - no bleach needed'
    reasons.push(`Target is ${lift} level(s) lighter: within permanent-colour lift (max ~3 levels).`)
    recommendation = lift === 3 ? 'Single-process colour with 30 Vol developer.' : 'Single-process colour with 20 Vol developer.'
  }
  const feasibility: Feasibility = {
    status, possible: status !== 'not_recommended', needsBleach, sessions, liftLevels: Math.max(0, lift),
    requiredCanvasLevel: requiredCanvas, headline, reasons, recommendation
  }

  // ---- quantities from hair length + density ----
  const baseByLength = { short: 40, medium: 60, long: 90 }[length]
  const density = clamp((input.hairAreaRatio ?? 0.18) / 0.18, 0.85, 1.25)
  const base = Math.round(baseByLength * density)

  // ---- bleach recipe (hair is lightened to canvasLevel) ----
  let bleachRecipe: FormulationResult['bleachRecipe']
  if (needsBleach) {
    const powder = Math.round(base * 0.55)
    const vol = bleachLift >= 5 ? 30 : 20
    bleachRecipe = {
      powderGrams: powder,
      developerVolume: vol,
      developerGrams: powder * 2,
      additive: `Bond builder - ${(Math.round((powder / 30) * 4 * 10) / 10).toFixed(1)} ml`,
      processingTimeMinutes: bleachLift >= 5 ? 50 : 35,
      notes: `Lighten Level ${currentLevel} -> Level ${canvasLevel}${sessions > 1 ? ` over ${sessions} sessions` : ''}. Check lift every 10 minutes; stop at pale ${EXPOSED[canvasLevel].name.toLowerCase()}.`
    }
  }

  // ---- colour mixture ----
  const level = needsBleach ? canvasLevel : targetLevel
  const shadeCode = `${targetLevel}.${tone.code}`
  const components: SubstanceComponent[] = []
  let mode: FormulationResult['colorMixture']['mode'] = 'permanent'
  let devVol = 0
  let ratio = '1:1'
  let dyeTotal = base
  let devGrams = 0

  if (isFashion) {
    mode = 'direct_dye'
    const dyeShare = isPastel ? 0.15 : 0.6
    const dye = Math.max(5, Math.round(base * dyeShare))
    components.push({
      name: `Direct dye - ${tone.name} (${shadeCode})`, type: 'reflect_dye', code: shadeCode, amountGrams: dye,
      description: 'Semi-permanent pigment, deposits without developer', colorPreview: input.targetHex
    })
    components.push({
      name: 'Clear mixing base / conditioner', type: 'base', code: 'CLEAR-BASE', amountGrams: base - dye,
      description: isPastel ? 'Dilutes the dye to a pastel intensity' : 'Smooths application and softens intensity', colorPreview: '#f8fafc'
    })
    ratio = 'dye : base'
    dyeTotal = base
  } else if (needsBleach) {
    mode = 'demi_toner'
    devVol = 6
    ratio = '1:2'
    dyeTotal = Math.round(base * 0.7)
    devGrams = dyeTotal * 2
    const corrective = tone.cool && canvasLevel >= 7 ? clamp(Math.round((canvasLevel - 5) * 0.8), 2, 4) : 0
    components.push({
      name: `Demi-permanent toner - ${tone.name} (${shadeCode})`, type: 'toner', code: shadeCode,
      amountGrams: dyeTotal - corrective,
      description: `Deposits the target tone on the lifted Level ${canvasLevel} canvas`, colorPreview: input.targetHex
    })
    if (corrective) {
      components.push({
        name: `${EXPOSED[canvasLevel].neutraliser} corrective concentrate`, type: 'booster', code: '0.' + (EXPOSED[canvasLevel].neutraliser.includes('Violet') ? '2' : '8'),
        amountGrams: corrective, description: `Neutralises exposed ${EXPOSED[canvasLevel].name.toLowerCase()} warmth`, colorPreview: '#6d5bd0'
      })
    }
  } else {
    mode = 'permanent'
    devVol = lift >= 3 ? 30 : lift >= 1 ? 20 : gray >= 50 ? 20 : 10
    ratio = '1:1'
    dyeTotal = base
    devGrams = base
    const naturalGrams = gray > 0 ? Math.round(base * Math.max(0.25, gray / 100)) : 0
    const boost = (tone.code === '66' || tone.code === '6' || tone.code === '4') && chroma > 45 ? 5 : 0
    const corrective = lift >= 2 && tone.cool && currentLevel + lift >= 7 ? 2 : 0
    const fill = lift <= -4 && ['6', '66', '4', '3'].includes(tone.code) ? Math.round(base * 0.25) : 0
    const primary = dyeTotal - naturalGrams - boost - corrective - fill
    if (naturalGrams) {
      components.push({
        name: `Natural base (${targetLevel}.0)`, type: 'base_dye', code: `${targetLevel}.0`, amountGrams: naturalGrams,
        description: `Grey coverage (~${gray}% grey detected) and depth anchor`, colorPreview: input.targetHex
      })
    }
    components.push({
      name: `Target tone - ${tone.name} (${shadeCode})`, type: 'reflect_dye', code: shadeCode, amountGrams: primary,
      description: 'Primary pigment that creates the target shade', colorPreview: input.targetHex
    })
    if (boost) components.push({ name: 'Intensifier (red/copper)', type: 'booster', code: `0.${tone.code === '4' ? '4' : '6'}`, amountGrams: boost, description: 'Boosts vibrancy of the warm tone', colorPreview: input.targetHex })
    if (corrective) components.push({ name: 'Violet corrective concentrate', type: 'booster', code: '0.2', amountGrams: corrective, description: 'Neutralises warmth exposed by lifting', colorPreview: '#6d5bd0' })
    if (fill) components.push({ name: 'Pre-pigment warm fill', type: 'booster', code: `${Math.max(level, targetLevel)}.3`, amountGrams: fill, description: 'Replaces lost warm pigment when darkening a lot', colorPreview: '#b8791b' })
  }

  if (devVol) {
    components.push({
      name: `Cream developer ${devVol} Vol (${(devVol / 3.33).toFixed(1)}%)`, type: 'developer', code: `DEV-${devVol}V`, amountGrams: devGrams,
      description: mode === 'demi_toner' ? 'Low volume - tones without further lifting' : lift > 0 ? `Provides ~${Math.min(3, lift)} level(s) of lift` : 'Deposit only, no lift', colorPreview: '#f8fafc'
    })
  }
  components.push({
    name: 'Bond protector + argan oil', type: 'additive', code: 'BOND-DEFENSE', amountGrams: 5,
    description: 'Protects the cuticle and locks in shine', colorPreview: '#fbbf24'
  })

  const mixTotal = components.reduce((s, c) => s + c.amountGrams, 0)
  const glossToner = needsBleach && mode !== 'demi_toner'
    ? { required: true, formula: `Acidic gloss ${targetLevel}${tone.cool ? 'V' : 'P'}`, developerVolume: 6, developerGrams: base, processingMinutes: 20 }
    : undefined

  // ---- application steps ----
  const steps: FormulationResult['applicationSteps'] = []
  let s = 1
  if (needsBleach && bleachRecipe) {
    steps.push({
      step: s++, phase: sessions > 1 ? `Bleach sessions (x${sessions})` : 'Pre-lighten (bleach)',
      instruction: `Mix ${bleachRecipe.powderGrams} g bleach + ${bleachRecipe.developerGrams} g ${bleachRecipe.developerVolume} Vol + ${bleachRecipe.additive}. Apply mid-lengths to ends first, roots last (keep 1 cm off scalp for 30 Vol). ${bleachRecipe.notes}`,
      timeMinutes: bleachRecipe.processingTimeMinutes
    })
    steps.push({ step: s++, phase: 'Rinse & equalise', instruction: 'Rinse, shampoo with an acidic shampoo, towel-dry to ~80% to even out porosity.', timeMinutes: 10 })
  }
  steps.push({
    step: s++,
    phase: mode === 'direct_dye' ? 'Apply direct dye' : mode === 'demi_toner' ? 'Tone the lightened hair' : 'Apply colour',
    instruction: mode === 'direct_dye'
      ? 'Apply to damp, lightened hair in sections with gloves; leave 20-30 minutes. No heat needed.'
      : lift > 0 && !needsBleach
        ? 'Apply to lengths and ends first (15 min), then roots (25 min) to avoid hot roots.'
        : 'Apply root to ends, ensure even saturation, process as directed.',
    timeMinutes: mode === 'direct_dye' ? 25 : needsBleach ? 20 : 35
  })
  steps.push({ step: s++, phase: 'Rinse & seal', instruction: 'Emulsify, rinse until clear, finish with an acidic colour sealer (pH 4.5).', timeMinutes: 5 })

  return {
    currentLevel,
    targetLevel,
    undertoneAtTarget: needsBleach ? EXPOSED[canvasLevel].name : EXPOSED[targetLevel].name,
    liftRequired: Math.max(0, lift),
    needsBleach,
    feasibility,
    toneDescription: `${tone.name} (${shadeCode})`,
    bleachRecipe,
    colorMixture: { mode, totalProductGrams: Math.round(mixTotal), developerVolume: devVol, mixingRatio: ratio, developerGrams: devGrams, components },
    glossToner,
    applicationSteps: steps,
    salonCareNotes: [
      'Wait 48 hours before the first shampoo so pigment can settle.',
      'Wash in cool/lukewarm water; heat fades colour fastest.',
      tone.cool || needsBleach ? 'Use a purple/blue toning shampoo weekly to hold the tone.' : 'Use a sulfate-free, colour-safe shampoo and UV protectant.',
      'Deep condition weekly; lightened hair needs extra moisture and bond care.'
    ],
    pantoneHex: input.targetHex
  }
}
