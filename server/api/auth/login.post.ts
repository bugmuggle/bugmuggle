import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { compareSync } from 'bcryptjs'

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

    if (!queryUser) {
      return createError(ERR_RESPONSE_ACCOUNT_NOT_FOUND)
    }

    const [queryHash] = await db.select()
      .from(tables.passwordHash)
      .where(
        eq(tables.passwordHash.userId, queryUser.id)
      )
      .limit(1)

    if (!(queryHash && compareSync(password, queryHash.hash))) {
      return createError(ERR_RESPONSE_UNAUTHORIZED)
    }

    await setUserSession(event, {
      user: {
        id: queryUser.id,
        email: queryUser.email
      }
    })

    return queryUser
  } catch (error) {
    console.error(error)
    return createError(ERR_RESPONSE_INTERNAL_SERVER_ERROR)
  }
})