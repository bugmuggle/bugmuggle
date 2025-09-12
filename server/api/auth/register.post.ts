import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { H3Event } from 'h3'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.email('Invalid Emailw'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .refine(p => /[A-Z]/.test(p), { message: 'Password must contain an uppercase letter' })
    .refine(p => /[a-z]/.test(p), { message: 'Password must contain a lowercase letter' })
    .refine(p => /\d/.test(p), { message: 'Password must contain a number' })
    .refine(p => /[!@#$%^&*(),.?":{}|<>]/.test(p), { message: 'Password must contain a special character' }),
  firstName: z.string().min(2, 'First name must be at least 2 characters long').trim(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long').trim(),
})

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
  const db = useDrizzle()
  const body = await readBody(event);
  const parsed = registerSchema.parse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0].message })
  }
  const { email, password, firstName, lastName } = parsed;

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
        firstName,
        lastName,
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
