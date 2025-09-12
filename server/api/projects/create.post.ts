import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Project name is required'),
  userId: z.number().min(1, 'User ID is required')
})

export default defineAuthHandler(async (event) => {
  try {
    const body = await readBody(event)
    const parsedBody = schema.safeParse(body)
    if (!parsedBody.success) {
      return createError({ statusCode: 400, statusMessage: parsedBody.error.issues[0]?.message ?? 'Invalid input' });
    }

    const db = event.context.db
    const { projects } = tables

    const { name, userId } = parsedBody.data

    const [inserted] = await db.insert(projects)
      .values({ name, createdBy: userId })
      .returning()

    return inserted
  } catch (error) {
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
