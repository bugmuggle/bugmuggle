import { eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const [hasAdmin] = await db.select()
    .from(schema.admins)
    .where(eq(schema.admins.rootAdmin, true))
    .limit(1)

  return {
    admin: !!hasAdmin
  }
})
