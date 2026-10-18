import { processHairPhoto } from '~/server/utils/hair/pipeline'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body?.image || !body?.targetHex) {
    throw createError({ statusCode: 400, statusMessage: 'image (data URL) and targetHex are required' })
  }
  const data = await processHairPhoto({
    image: body.image,
    targetHex: body.targetHex,
    secondaryHex: body.secondaryHex,
    colorType: body.colorType,
    gloss: body.gloss,
    rootDarkness: body.rootDarkness,
    colorFamily: body.colorFamily,
    colorName: body.colorName,
    currentLevelOverride: body.currentLevelOverride
  })
  return { success: true, data }
})
