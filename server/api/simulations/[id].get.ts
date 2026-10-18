import { getDatabase, ensureDatabaseReady, schema, inMemorySimulations } from '~/server/utils/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const db = getDatabase()
  if (!db) {
    const found = inMemorySimulations.find(s => s.id === id)
    if (!found) throw createError({ statusCode: 404, statusMessage: 'Simulation not found' })
    return {
      success: true,
      data: {
        ...found,
        formula: found.formulaJson || found.formula || {}
      }
    }
  }

  await ensureDatabaseReady()

  try {
    const [row] = await db
      .select()
      .from(schema.simulations)
      .where(eq(schema.simulations.id, id))
      .limit(1)

    if (!row) {
      throw createError({ statusCode: 404, statusMessage: 'Simulation not found' })
    }

    return {
      success: true,
      data: {
        ...row,
        formula: row.formulaJson
      }
    }
  } catch (err: any) {
    if (err.statusCode === 404) throw err
    console.error('[API] Error fetching simulation by ID from PostgreSQL:', err)
    throw createError({ statusCode: 500, statusMessage: 'Database error' })
  }
})
