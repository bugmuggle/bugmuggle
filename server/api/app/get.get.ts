export default defineEventHandler(async (event) => {
  try {
    const db = useDb()!

    const hasAdmin = (await db
      .select()
      .from(tables.admins)
      .limit(1)).length > 0

    return {
      hasAdmin,
      // Other app details here
    }
  } catch (error) {
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal error' })
  }
})
