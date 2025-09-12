import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { getRequestIP, type H3Event } from 'h3'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

// Simple in-memory rate limiter per IP
const attemptsByIp = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_ATTEMPTS = 10

function getClientIp(event: H3Event): string {
  try {
    return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  } catch {
    return 'unknown'
  }
}

function isRateLimited(event: H3Event): boolean {
  const now = Date.now()
  const ip = getClientIp(event)
  const record = attemptsByIp.get(ip) || []
  const recent = record.filter(t => now - t < WINDOW_MS)
  recent.push(now)
  attemptsByIp.set(ip, recent)
  return recent.length > MAX_ATTEMPTS
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
  if (isRateLimited(event)) {
    throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })
  }

  try {
    const db = useDrizzle()
    const body = await readBody(event)
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0].message })
    }
    const { email, password } = parsed;

    const { jwtSecret } = useRuntimeConfig(event)
    if (!jwtSecret) {
      throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
    }

    const usersFound = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1)
    const user = usersFound[0]
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const passRows = await db
      .select()
      .from(tables.passwordHash)
      .where(eq(tables.passwordHash.userId, user.id))
      .limit(1)
    const passwordRow = passRows[0]
    if (!passwordRow) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }
    const isPasswordValid = await bcrypt.compare(password, passwordRow.hash)
    if (!isPasswordValid) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const expiresIn = 3600
    const token = signJwt(
      {
        sub: String(user.id),
        email: user.email,
      },
      jwtSecret,
      expiresIn,
    )

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.firstName ?? '',
      },
    }
  } catch (error: unknown) {
    if (error && (error as { statusCode?: number }).statusCode) throw error
    console.error('Login error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
