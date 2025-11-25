import { z } from 'zod';

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


})
