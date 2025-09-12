import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { H3Event } from 'h3'

function assertValidRegistrationBody(body: unknown) {
  const { email, password, name } = body as { email?: string; password?: string; name?: string }

  if (typeof email !== 'string' || !email.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email is required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email format is required' })
  }

  if (typeof password !== 'string' || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters long' })
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must contain uppercase, lowercase, number, and special character',
    })
  }

  if (typeof name !== 'string' || !name.trim() || name.trim().length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Name must be at least 2 characters long' })
  }

  return {
    email: email.trim().toLowerCase(),
    password,
    name: name.trim(),
  }
}

function signJwt(payload: { sub: string; email: string }, secret: string, expiresInSeconds: number) {
  return jwt.sign(
    {
      ...payload,
      iss: 'bugmuggle',
      sub: String(payload.sub),
    },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: expiresInSeconds,
    },
  )
}

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { email, password, name } = assertValidRegistrationBody(body)
  const db = useDrizzle()

  const { jwtSecret } = useRuntimeConfig(event)
  if (!jwtSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }

  try {
    const existing = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1)
    if (existing[0]) {
      throw createError({ statusCode: 409, statusMessage: 'User already exists' })
    }

    const saltRounds = 12
    const hash = await bcrypt.hash(password, saltRounds)

    const insertedUsers = await db
      .insert(tables.users)
      .values({
        email,
        firstName: name, // storing full name in firstName for now
        createdAt: new Date(),
      })
      .returning()

    const createdUser = insertedUsers[0]

    await db
      .insert(tables.passwordHash)
      .values({
        userId: createdUser.id,
        hash,
      })

    const expiresIn = 3600
    const token = signJwt(
      {
        sub: String(createdUser.id),
        email: createdUser.email,
      },
      jwtSecret,
      expiresIn,
    )

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.firstName ?? '',
      },
      message: 'Registration successful',
    }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode
    if (typeof statusCode === 'number') throw error

    const pgCode = (error as { code?: string })?.code
    if (pgCode === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'User already exists' })
    }

    console.error('Registration error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
