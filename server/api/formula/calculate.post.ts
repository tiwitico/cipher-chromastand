import { calculateColorFormula, type HairChemistryInput } from '~/server/utils/hairChemistry'

// Manual recalculation (e.g. user corrects the detected level). Uses the same engine as /api/hair/process.
export default defineEventHandler(async (event) => {
  const body = await readBody<HairChemistryInput>(event)

  if (!body || !body.targetHex) {
    throw createError({ statusCode: 400, statusMessage: 'targetHex is required' })
  }

  return { success: true, data: calculateColorFormula(body) }
})
