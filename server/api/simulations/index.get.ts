import { getDatabase, ensureDatabaseReady, schema, inMemorySimulations } from '~/server/utils/db'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = getDatabase()
  if (!db) {
    // Return in-memory fallback list
    return {
      success: true,
      data: inMemorySimulations
    }
  }

  await ensureDatabaseReady()

  try {
    const rows = await db
      .select({
        id: schema.simulations.id,
        title: schema.simulations.title,
        client_name: schema.simulations.clientName,
        hair_style_id: schema.simulations.hairStyleId,
        hair_style_name: schema.simulations.hairStyleName,
        hair_category: schema.simulations.hairCategory,
        color_hex: schema.simulations.colorHex,
        color_name: schema.simulations.colorName,
        color_family: schema.simulations.colorFamily,
        secondary_color_hex: schema.simulations.secondaryColorHex,
        base_hair_level: schema.simulations.baseHairLevel,
        target_hair_level: schema.simulations.targetHairLevel,
        hair_length: schema.simulations.hairLength,
        front_image: schema.simulations.frontImage,
        side_image: schema.simulations.sideImage,
        back_image: schema.simulations.backImage,
        ai_analysis_json: schema.simulations.aiAnalysisJson,
        created_at: schema.simulations.createdAt,
      })
      .from(schema.simulations)
      .orderBy(desc(schema.simulations.createdAt))

    return {
      success: true,
      data: rows
    }
  } catch (err) {
    console.error('[API] Error retrieving simulations from PostgreSQL:', err)
    return {
      success: true,
      data: inMemorySimulations
    }
  }
})
