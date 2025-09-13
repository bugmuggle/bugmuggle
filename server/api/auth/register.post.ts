import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { genSaltSync, hashSync } from 'bcryptjs'

const schema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(1, 'Password is required')
})

export default defineEventHandler(async (event) => {
  try {
    const rawBody = await readBody(event)
    const parseBody = schema.safeParse(rawBody)

    if (!parseBody.success) {
      return createError(ERR_RESPONSE_BAD_REQUSET)
    }

    const { email, password } = parseBody.data
    const db = event.context.db

    const [queryUser] = await db.select()
      .from(tables.users)
      .where(
        eq(tables.users.email, email)
      )
      .limit(1)

    if (queryUser) {
      return createError(ERR_RESPONSE_ACCOUNT_ALREADY_EXISTS)
    }

    const [newUser] = await db.insert(tables.users)
      .values({
        email: email
      })
      .returning()

    const newHash = hashSync(password, genSaltSync())

    await Promise.allSettled([
      db.insert(tables.passwordHash)
        .values({ userId: newUser.id, hash: newHash }),

      setUserSession(event, {
          user: { id: newUser.id, email: newUser.email }
        })
    ])

    return newUser
  } catch (error) {
    console.error(error)
    return createError(ERR_RESPONSE_INTERNAL_SERVER_ERROR)
  }
})