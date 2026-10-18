import { SAMPLE_MODELS } from '~/utils/sampleModels'
import type { HairProcessResult } from '~/components/HairSimulatorCanvas.vue'

export function useHairSession() {
  const currentPhoto = useState<string>('hair_current_photo', () => SAMPLE_MODELS[0].imageUrl)
  const currentBaseLevel = useState<number>('hair_base_level', () => 4)
  const currentHairTone = useState<string>('hair_current_tone', () => 'Level 4 · Neutral Brown')
  const processResult = useState<HairProcessResult | null>('hair_process_result', () => null)
  const levelOverride = useState<number | null>('hair_level_override', () => null)

  const currentColorHex = useState<string>('hair_color_hex', () => '#B8491A')
  const currentColorName = useState<string>('hair_color_name', () => 'Fiery Irish Copper')
  const currentColorFamily = useState<string>('hair_color_family', () => 'copper')
  const currentSecondaryHex = useState<string>('hair_secondary_hex', () => '#D1AC61')
  const currentColorTechnique = useState<'solid' | 'balayage' | 'ombre' | 'highlights'>('hair_technique', () => 'balayage')
  const currentGloss = useState<number>('hair_gloss', () => 75)
  const currentRootDepth = useState<number>('hair_root_depth', () => 25)
  const savedCount = useState<number>('hair_saved_count', () => 0)

  async function fetchSavedCount() {
    try {
      const res = await $fetch<{ success: boolean, data: any[] }>('/api/simulations')
      if (res.success && res.data) {
        savedCount.value = res.data.length
      }
    } catch {
      // Ignore on initialization
    }
  }

  function setPhoto(photoUrl: string) {
    currentPhoto.value = photoUrl
    levelOverride.value = null
    processResult.value = null
  }

  function setColor(data: {
    colorHex: string
    colorName: string
    colorFamily?: string
    secondaryHex?: string
    technique?: 'solid' | 'balayage' | 'ombre' | 'highlights'
    gloss?: number
    rootDepth?: number
  }) {
    currentColorHex.value = data.colorHex
    currentColorName.value = data.colorName
    if (data.colorFamily) currentColorFamily.value = data.colorFamily
    if (data.secondaryHex) currentSecondaryHex.value = data.secondaryHex
    if (data.technique) currentColorTechnique.value = data.technique
    if (typeof data.gloss === 'number') currentGloss.value = data.gloss
    if (typeof data.rootDepth === 'number') currentRootDepth.value = data.rootDepth
  }

  function applyRecommendation(colorHex: string, colorName: string, colorFamily = 'copper') {
    currentColorHex.value = colorHex
    currentColorName.value = colorName
    currentColorFamily.value = colorFamily
  }

  return {
    currentPhoto,
    currentBaseLevel,
    currentHairTone,
    processResult,
    levelOverride,
    currentColorHex,
    currentColorName,
    currentColorFamily,
    currentSecondaryHex,
    currentColorTechnique,
    currentGloss,
    currentRootDepth,
    savedCount,
    fetchSavedCount,
    setPhoto,
    setColor,
    applyRecommendation
  }
}
