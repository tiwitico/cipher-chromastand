import { getDatabase, ensureDatabaseReady, schema, DEFAULT_COLOR_PRESETS } from '~/server/utils/db'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = getDatabase()
  if (!db) {
    return {
      success: true,
      data: DEFAULT_COLOR_PRESETS
    }
  }

  await ensureDatabaseReady()

  try {
    const colors = await db
      .select()
      .from(schema.colorPresets)
      .orderBy(asc(schema.colorPresets.level), asc(schema.colorPresets.name))

    return {
      success: true,
      data: colors.length > 0 ? colors : DEFAULT_COLOR_PRESETS
    }
  } catch (err) {
    console.error('[API] Error querying color presets from PostgreSQL:', err)
    return {
      success: true,
      data: DEFAULT_COLOR_PRESETS
    }
  }
})
