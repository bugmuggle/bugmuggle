import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { genSaltSync, hashSync } from 'bcryptjs'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsedBody = loginSchema.safeParse(body);

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: parsedBody.error.issues,
    });
  }

  const { email, password } = parsedBody.data;

  const db = useDb()!

  const hasAdmin = (await db
    .select()
    .from(tables.admins)
    .limit(1)).length > 0

  if (hasAdmin) {
    return createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Account already set up.',
    });
  }

  const isEmailTaken = (await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .limit(1)).length > 0

  if (isEmailTaken) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Conflict: Email already in use.',
    });
  }

  const hashPassword = hashSync(password, genSaltSync())

  const [newUser] = await db.insert(tables.users)
    .values({
      email,
      hashPassword
    })
    .returning()

  await db.insert(tables.admins)
    .values({
      userId: newUser.id
    })

  await setUserSession(event, {
    user: {
      id: newUser.id,
      email: newUser.email
    }
  })

  return { success: true }
})
