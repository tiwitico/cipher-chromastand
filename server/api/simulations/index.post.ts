import { getDatabase, ensureDatabaseReady, schema, inMemorySimulations } from '~/server/utils/db'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.hairStyleId || !body.colorHex) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing hairStyleId or colorHex'
    })
  }

  const id = 'sim_' + randomUUID().substring(0, 12)
  const formulaObj = typeof body.formula === 'object' ? body.formula : JSON.parse(body.formula || '{}')
  const aiAnalysisObj = typeof body.aiAnalysis === 'object' ? body.aiAnalysis : body.aiAnalysis ? JSON.parse(body.aiAnalysis) : null

  const newRecord = {
    id,
    title: body.title || `${body.hairStyleName || 'Modern Style'} in ${body.colorName || 'Custom Shade'}`,
    clientName: body.clientName || 'My Look',
    userPhoto: body.userPhoto || null,
    hairStyleId: body.hairStyleId,
    hairStyleName: body.hairStyleName || 'Custom Style',
    hairCategory: body.hairCategory || 'Contemporary',
    colorHex: body.colorHex,
    colorName: body.colorName || 'Custom Color',
    colorFamily: body.colorFamily || 'natural',
    secondaryColorHex: body.secondaryColorHex || null,
    baseHairLevel: body.baseHairLevel ?? 3,
    targetHairLevel: body.targetHairLevel ?? 7,
    hairLength: body.hairLength || 'medium',
    hairTexture: body.hairTexture || 'medium',
    grayPercentage: body.grayPercentage ?? 0,
    formulaJson: formulaObj,
    frontImage: body.frontImage || null,
    sideImage: body.sideImage || null,
    backImage: body.backImage || null,
    aiAnalysisJson: aiAnalysisObj,
  }

  const db = getDatabase()
  if (!db) {
    // In-memory fallback
    inMemorySimulations.unshift({
      ...newRecord,
      client_name: newRecord.clientName,
      hair_style_id: newRecord.hairStyleId,
      hair_style_name: newRecord.hairStyleName,
      hair_category: newRecord.hairCategory,
      color_hex: newRecord.colorHex,
      color_name: newRecord.colorName,
      color_family: newRecord.colorFamily,
      secondary_color_hex: newRecord.secondaryColorHex,
      base_hair_level: newRecord.baseHairLevel,
      target_hair_level: newRecord.targetHairLevel,
      hair_length: newRecord.hairLength,
      front_image: newRecord.frontImage,
      side_image: newRecord.sideImage,
      back_image: newRecord.backImage,
      created_at: new Date().toISOString(),
    })
    return {
      success: true,
      data: { id }
    }
  }

  await ensureDatabaseReady()

  try {
    await db.insert(schema.simulations).values(newRecord)
    return {
      success: true,
      data: { id }
    }
  } catch (err) {
    console.error('[API] Error inserting simulation into PostgreSQL:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to insert simulation into database'
    })
  }
})
