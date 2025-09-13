import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../database/schema';

export const tables = schema

export function useDrizzle () {
  const dbUrl = useRuntimeConfig().databaseUrl

  if (!dbUrl) {
    throw createError('Missing `NUXT_DATABASE_URL` environment variable')
  }

  return drizzle(dbUrl as string, { schema })
}
