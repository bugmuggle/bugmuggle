import { z } from 'zod'
import { eq } from 'drizzle-orm'

const schema = z.object({
  name: z.string().min(1, 'Project name is required')
})

export default defineAuthHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')
    const projectId = Number(idParam)

    if (!projectId || Number.isNaN(projectId) || projectId < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid project id' })
    }

    const body = await readBody(event)
    const parsedBody = schema.safeParse(body)
    if (!parsedBody.success) {
      throw createError({ statusCode: 400, statusMessage: parsedBody.error.issues[0]?.message ?? 'Invalid input' })
    }

    const { name } = parsedBody.data

    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
    }

    const db = event.context.db
    const { projects } = tables

    const [existing] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)

    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }

    const [updated] = await db.update(projects)
      .set({
        name,
        updatedAt: new Date()
      })
      .where(eq(projects.id, projectId))
      .returning()

    return updated
  } catch (error) {
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
