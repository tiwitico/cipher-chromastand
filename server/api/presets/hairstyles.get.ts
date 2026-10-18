import { getDatabase, ensureDatabaseReady, schema, DEFAULT_HAIR_STYLES } from '~/server/utils/db'
import { desc, asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = getDatabase()
  if (!db) {
    // Fallback to default catalog if database URL is not configured
    return {
      success: true,
      data: DEFAULT_HAIR_STYLES
    }
  }

  await ensureDatabaseReady()

  try {
    const styles = await db
      .select()
      .from(schema.hairStyles)
      .orderBy(desc(schema.hairStyles.trending), asc(schema.hairStyles.name))

    return {
      success: true,
      data: styles.length > 0 ? styles : DEFAULT_HAIR_STYLES
    }
  } catch (err) {
    console.error('[API] Error querying hairstyles from PostgreSQL:', err)
    return {
      success: true,
      data: DEFAULT_HAIR_STYLES
    }
  }
})
