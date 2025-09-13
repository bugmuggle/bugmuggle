import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../database/schema'
import { and, eq } from 'drizzle-orm'

export const verifyAccessToProject = async (
  db: PostgresJsDatabase<typeof schema> | null = null,
  userId: number = -1,
  projectId: number = -1
) => {
  try {
    if (!db) {
      return { success: false }
    }

    const [queryMembership] = await db.select()
      .from(schema.projectMemberships)
      .where(and(
        eq(schema.projectMemberships.projectId, projectId),
        eq(schema.projectMemberships.userId, userId)
      ))
      .limit(1)

    if (!queryMembership) {
      return {
        success: false
      }
    }

    return {
      success: true,
      data: queryMembership
    }
  } catch (error) {
    console.error(error)
    return {
      success: false
    }
  }
}