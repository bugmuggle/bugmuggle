import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { eq } from 'drizzle-orm'
import { getRequestIP, type H3Event } from 'h3'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

const limiter = new RateLimiterMemory({
  points: 10, // max attempts
  duration: 600, // per 10 minutes
})

function normalizeIp(ip: string) {
  if (ip === '::1') return '127.0.0.1'
  return ip
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

  try {
    const ip = normalizeIp(getRequestIP(event, { xForwardedFor: true }) || 'unknown')
    console.log(ip);
    await limiter.consume(ip)
  } catch {
    throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })
  }

  try {
    const db = useDrizzle()
    const body = await readBody(event)
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0].message });
    }
    const { email, password } = parsed.data;

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
