import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Project name is missing'),
  userId: z.number().min(1, 'User ID is missing')
})

export default defineAuthHandler(async (event) => {
  try {
    const raw = await readBody(event)
    const parsedBody = schema.safeParse(raw)

    if (!parsedBody.success) {
      throw parsedBody.error.issues
    }

    return true
  } catch (error) {
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
