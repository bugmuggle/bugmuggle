import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { compareSync } from 'bcryptjs'

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

  const [queryUser] = await db.select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .limit(1)

  if (!queryUser) {
    return createError({ statusCode: 403, statusMessage: 'Unauthorized' })
  }

  if (!compareSync(queryUser.hashPassword as string, password)) {
    return createError({ statusCode: 403, statusMessage: 'Unauthorized' })
  }

  await setUserSession(event, {
    user: {
      id: queryUser.id,
      firstName: queryUser.firstName,
      lastName: queryUser.lastName,
      email: queryUser.email
    }
  })

  return { success: true }
})
