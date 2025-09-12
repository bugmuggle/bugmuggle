import { eq } from 'drizzle-orm'

export default defineAuthHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')
    const projectId = Number(idParam)

    if (!projectId || Number.isNaN(projectId) || projectId < 0) {
      return createError({ statusCode: 400, statusMessage: 'Invalid project id' })
    }

    const db = event.context.db
    const { projects } = tables

    const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)

    if (!project) {
      return createError({ statusCode: 404, statusMessage: 'Project not found' })
    }

    return project

  } catch (error: unknown) {
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
