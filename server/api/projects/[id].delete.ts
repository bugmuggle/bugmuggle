import { eq } from 'drizzle-orm'

export default defineAuthHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')
    const projectId = Number(idParam)

    if (!projectId || Number.isNaN(projectId) || projectId < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid project id' })
    }

    const db = event.context.db
    const { projects } = tables

    const [existing] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
    if (!existing) {
      return createError({ statusCode: 404, statusMessage: 'Project not found' })
    }

    const [deleted] = await db.delete(projects)
      .where(eq(projects.id, projectId))
      .returning()
    return deleted

  } catch (error: unknown) {
    const maybePgErr = error as { code?: string }
    if (maybePgErr && maybePgErr.code === '23503') {
      return createError({ statusCode: 409, statusMessage: 'Internal Server Error' })
    }

    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
