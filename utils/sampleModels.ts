export interface SampleModel {
  id: string
  name: string
  gender: 'female' | 'male'
  skinTone: string
  initialHairLevel: number
  description: string
  imageUrl: string
}

export const SAMPLE_MODELS: SampleModel[] = [
  {
    id: 'sample_elena',
    name: 'Elena (Warm Brunette)',
    gender: 'female',
    skinTone: '#f5cbb0',
    initialHairLevel: 4,
    description: 'Natural brunette portrait with warm undertones and textured lengths',
    imageUrl: '/models/woman_brunette.jpg'
  },
  {
    id: 'sample_marcus',
    name: 'Marcus (Chiseled Crop)',
    gender: 'male',
    skinTone: '#e5b997',
    initialHairLevel: 2,
    description: 'Deep espresso starting base with structured modern crop',
    imageUrl: '/models/man_crop.jpg'
  },
  {
    id: 'sample_clara',
    name: 'Clara (Light Golden)',
    gender: 'female',
    skinTone: '#f8dcce',
    initialHairLevel: 7,
    description: 'Fair complexion with natural light brown/blonde base level 7',
    imageUrl: '/models/woman_blonde.jpg'
  },
  {
    id: 'sample_devon',
    name: 'Devon (Natural Bronze)',
    gender: 'male',
    skinTone: '#935d39',
    initialHairLevel: 1,
    description: 'Jet black natural base level 1 with warm skin undertone',
    imageUrl: '/models/man_curly.jpg'
  }
]
