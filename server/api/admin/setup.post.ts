import { eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const setupSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
})

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10)
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = setupSchema.safeParse(body)

    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid input data'
      })
    }

    const { token, email, password } = result.data

    // Validate token: token must be valid and should be available in the process.env.BUGMUGGLE_ONE_OFF_ADMIN_TOKEN
    const envToken = process.env.BUGMUGGLE_ONE_OFF_ADMIN_TOKEN
    if (!envToken || token !== envToken) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Unauthorized: Invalid setup token'
      })
    }

    const [hasAdmin] = await db.select()
      .from(schema.admins)
      .where(eq(schema.admins.rootAdmin, true))
      .limit(1)

    if (hasAdmin) {
      throw createError({
        statusCode: 400,
        statusMessage: "Admin already setup. Can't setup, use page /admin/reset"
      })
    }

    // Create user
    const [user] = await db.insert(schema.users).values({
      name: 'Root Admin',
      email: email,
      password: hashPassword(password),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    }).returning()

    if (!user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create user'
      })
    }

    // Add user into root admin
    await db.insert(schema.admins).values({
      uid: user.id,
      rootAdmin: true
    })

    return {
      success: true,
      message: 'Admin account created successfully'
    }

  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('[Admin Setup Error]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})