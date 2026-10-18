import { analyzeHairStyleAndColorWithGemini } from '~/server/utils/gemini'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is required'
    })
  }

  const analysis = await analyzeHairStyleAndColorWithGemini({
    imageBase64: body.imageBase64,
    userNotes: body.userNotes,
    currentHairLevel: body.currentHairLevel,
    preferredTone: body.preferredTone,
    modelName: body.modelName || 'gemini-2.5-flash',
  })

  return {
    success: true,
    data: analysis
  }
})
