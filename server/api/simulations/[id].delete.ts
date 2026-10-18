import { getDatabase, ensureDatabaseReady, schema, inMemorySimulations } from '~/server/utils/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const db = getDatabase()
  if (!db) {
    const idx = inMemorySimulations.findIndex(s => s.id === id)
    if (idx !== -1) {
      inMemorySimulations.splice(idx, 1)
      return { success: true, deleted: true }
    }
    return { success: true, deleted: false }
  }

  await ensureDatabaseReady()

  try {
    const result = await db
      .delete(schema.simulations)
      .where(eq(schema.simulations.id, id))

    return {
      success: true,
      deleted: true
    }
  } catch (err) {
    console.error('[API] Error deleting simulation from PostgreSQL:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete simulation' })
  }
})
