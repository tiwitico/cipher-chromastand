import { GoogleGenAI } from '@google/genai'

export interface ChromaticFaceProfile {
  skinToneLab: {
    L: number
    a: number
    b: number
    hex: string
    undertoneDescription: string
  }
  eyeChroma: {
    name: string
    hex: string
    warmth: 'Warm' | 'Cool' | 'Neutral'
  }
  contrastLevel: 'Low Contrast' | 'Medium Contrast' | 'High Contrast'
  seasonalArchetype: 'Deep Autumn' | 'Warm Spring' | 'Cool Summer' | 'Deep Winter' | 'Soft Autumn' | 'Clear Spring'
  colorTheoryReasoning: string
}

export interface AiStylistAnalysisResult {
  faceShape: 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Oblong'
  skinUndertone: 'Warm Golden' | 'Cool Rosy' | 'Neutral' | 'Olive'
  detectedStartingLevel: number
  chromaticProfile: ChromaticFaceProfile
  recommendedHairstyles: {
    styleId: string
    styleName: string
    flatteryScore: number // 1 to 100
    rationale: string
  }[]
  recommendedColors: {
    colorName: string
    colorHex: string
    targetLevel: number
    colorFamily: string
    harmonyType: 'analogous_enhancer' | 'complementary_eye_pop' | 'high_fashion_contrast'
    whyItFits: string
  }[]
  chemicalFormulationGuidance: {
    suggestedDeveloperVolume: number
    requiresBleach: boolean
    liftNotes: string
    porosityCaution: string
    customMixTips: string
  }
  atHomeStylingTips: string[]
  rawExplanation?: string
}

export function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY
  const useVertex = process.env.GOOGLE_GENAI_USE_VERTEX === 'true'

  if (useVertex) {
    const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
    return new GoogleGenAI({
      vertexAI: true,
      project,
      location
    })
  }

  if (!apiKey) {
    return null
  }

  return new GoogleGenAI({ apiKey })
}

export async function analyzeHairStyleAndColorWithGemini(options: {
  imageBase64?: string
  userNotes?: string
  currentHairLevel?: number
  preferredTone?: string
  modelName?: 'gemini-2.5-flash' | 'gemini-2.5-pro'
}): Promise<AiStylistAnalysisResult> {
  const modelToUse = options.modelName || 'gemini-2.5-flash'
  const ai = getGenAIClient()

  // Graceful fallback for local development if GEMINI_API_KEY is not configured yet
  if (!ai) {
    console.warn('[Gemini] GEMINI_API_KEY not found in environment. Generating intelligent simulated response.')
    return generateFallbackAiAnalysis(options)
  }

  const prompt = `
You are an expert celebrity hair stylist, salon chemical colorist, and chromatic color science specialist.
Analyze the user's uploaded portrait: facial bone geometry, precise skin undertone (in CIELAB L*a*b* coordinates), eye iris chroma, contrast level, and natural hair canvas.

User Context:
- User Preferences / Notes: "${options.userNotes || 'None specified. Recommend the most flattering modern look.'}"
- Estimated Starting Hair Level: ${options.currentHairLevel || 3} (1 = Jet Black, 10 = Extra Light Blonde)
- Preferred Tone/Shade: ${options.preferredTone || 'Flexible'}

Provide your expert recommendations in strict JSON format matching this exact schema:
{
  "faceShape": "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong",
  "skinUndertone": "Warm Golden" | "Cool Rosy" | "Neutral" | "Olive",
  "detectedStartingLevel": integer (1 to 10),
  "chromaticProfile": {
    "skinToneLab": {
      "L": number (lightness 0-100),
      "a": number (green-to-red axis, -50 to 50),
      "b": number (blue-to-yellow axis, -50 to 50),
      "hex": string (e.g. "#F4D0B5"),
      "undertoneDescription": string
    },
    "eyeChroma": {
      "name": string (e.g. "Warm Hazel Amber", "Cool Slate Blue", "Deep Espresso"),
      "hex": string,
      "warmth": "Warm" | "Cool" | "Neutral"
    },
    "contrastLevel": "Low Contrast" | "Medium Contrast" | "High Contrast",
    "seasonalArchetype": "Deep Autumn" | "Warm Spring" | "Cool Summer" | "Deep Winter" | "Soft Autumn" | "Clear Spring",
    "colorTheoryReasoning": string
  },
  "recommendedHairstyles": [
    {
      "styleId": "style_curtain_waves" | "style_french_bob" | "style_wolf_cut" | "style_textured_crop" | "style_hollywood_glam" | "style_slick_undercut" | "style_pixie_undercut" | "style_beach_layers" | "style_korean_two_block" | "style_curly_afro_taper",
      "styleName": string,
      "flatteryScore": integer (80-100),
      "rationale": string
    }
  ],
  "recommendedColors": [
    {
      "colorName": string,
      "colorHex": string,
      "targetLevel": integer (1 to 10),
      "colorFamily": "natural" | "warm_gold" | "copper" | "red" | "ash" | "silver" | "fashion",
      "harmonyType": "analogous_enhancer" | "complementary_eye_pop" | "high_fashion_contrast",
      "whyItFits": string
    }
  ],
  "chemicalFormulationGuidance": {
    "suggestedDeveloperVolume": 10 | 20 | 30,
    "requiresBleach": boolean,
    "liftNotes": string,
    "porosityCaution": string,
    "customMixTips": string
  },
  "atHomeStylingTips": [string, string, string]
}
`

  const contents: any[] = []

  // Add multimodal image if provided
  if (options.imageBase64) {
    let cleanData = options.imageBase64
    let mimeType = 'image/jpeg'

    if (cleanData.startsWith('data:')) {
      const match = cleanData.match(/data:([^;]+);base64,(.+)/)
      if (match) {
        mimeType = match[1]
        cleanData = match[2]
      }
    }

    // Only attach if it's actual image data
    if (cleanData.length > 50) {
      contents.push({
        inlineData: {
          mimeType,
          data: cleanData
        }
      })
    }
  }

  contents.push({ text: prompt })

  try {
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      }
    })

    const textOutput = response.text || ''
    const parsed = JSON.parse(textOutput) as AiStylistAnalysisResult
    return parsed
  } catch (err) {
    console.error('[Gemini] Error calling model ' + modelToUse + ':', err)
    // Fall back to structured response on quota or network limits during hackathons
    return generateFallbackAiAnalysis(options)
  }
}

function generateFallbackAiAnalysis(options: {
  currentHairLevel?: number
  preferredTone?: string
  userNotes?: string
}): AiStylistAnalysisResult {
  const startingLvl = options.currentHairLevel || 3

  return {
    faceShape: 'Oval',
    skinUndertone: 'Warm Golden',
    detectedStartingLevel: startingLvl,
    chromaticProfile: {
      skinToneLab: {
        L: 71.4,
        a: 12.8,
        b: 19.5,
        hex: '#F2CCA8',
        undertoneDescription: 'Warm Golden Peach with slight peachy-carotenoid flush'
      },
      eyeChroma: {
        name: 'Warm Amber Hazel',
        hex: '#7A5229',
        warmth: 'Warm'
      },
      contrastLevel: 'Medium Contrast',
      seasonalArchetype: 'Warm Spring',
      colorTheoryReasoning: 'User exhibits warm peachy undertones (positive b* axis in CIELAB) and amber iris pigments. Warm analogous highlights (caramel/honey) complement facial brightness, while split-complementary copper tones make the hazel eye pigments pop dramatically without washing out the complexion.'
    },
    recommendedHairstyles: [
      {
        styleId: 'style_curtain_waves',
        styleName: 'Curtain Bangs & Tousled Waves',
        flatteryScore: 96,
        rationale: 'Curtain bangs soften cheekbones while loose waves add dimensional movement and frame the jawline beautifully.'
      },
      {
        styleId: 'style_french_bob',
        styleName: 'Chic French Micro Bob',
        flatteryScore: 92,
        rationale: 'A jawline-grazing blunt silhouette accentuates neck length and highlights cheek contours.'
      },
      {
        styleId: 'style_wolf_cut',
        styleName: 'Dimensional Shag & Wolf Cut',
        flatteryScore: 89,
        rationale: 'Choppy crown layers provide effortless natural lift without weighing down facial features.'
      }
    ],
    recommendedColors: [
      {
        colorName: 'Toasted Caramel Honey',
        colorHex: '#87532B',
        targetLevel: 6,
        colorFamily: 'warm_gold',
        harmonyType: 'analogous_enhancer',
        whyItFits: 'Analogous Harmony: Golden caramel ribbons harmonize naturally with warm skin undertones and create depth against base level ' + startingLvl + '.'
      },
      {
        colorName: 'Fiery Irish Copper',
        colorHex: '#B8491A',
        targetLevel: 6,
        colorFamily: 'copper',
        harmonyType: 'complementary_eye_pop',
        whyItFits: 'Complementary Harmony: Vibrant copper tones directly contrast with iris chroma to make amber and hazel eyes pop.'
      },
      {
        colorName: 'Bordeaux Cherry Wine',
        colorHex: '#7A1C2C',
        targetLevel: 4,
        colorFamily: 'red',
        harmonyType: 'high_fashion_contrast',
        whyItFits: 'High-Fashion Statement: Rich ruby-crimson undertones create sharp jawline definition and high-end gloss with minimal lift.'
      }
    ],
    chemicalFormulationGuidance: {
      suggestedDeveloperVolume: startingLvl <= 3 ? 20 : 10,
      requiresBleach: false,
      liftNotes: 'Direct permanent lift of 2-3 levels using 20 Vol developer without aggressive decolorization.',
      porosityCaution: 'Apply mixture to mid-lengths and ends for 15 minutes before touching scalp to avoid hot roots.',
      customMixTips: 'Incorporate 5g of bond-protecting elixir into the bowl to maintain cuticle luster.'
    },
    atHomeStylingTips: [
      'Use a microfiber towel to gently squeeze out moisture without roughing the hair cuticle.',
      'Apply a lightweight heat protectant spray prior to blow-drying with a medium round brush.',
      'Incorporate a sulfate-free color lock shampoo and wash with lukewarm water to extend tone longevity.'
    ],
    rawExplanation: 'Analysis generated using salon formulation rules (Set GEMINI_API_KEY in .env to enable live Gemini 2.5 Flash / Pro model responses).'
  }
}
