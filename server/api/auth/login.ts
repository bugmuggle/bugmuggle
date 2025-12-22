import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email or password format'
      })
    }

    const { email, password } = result.data

    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1)

    if (!user) {
      // generic error to not expose user existence
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid email or password'
      })
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid email or password'
      })
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    })

    return { id: user.id }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('[Login Error]:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})

