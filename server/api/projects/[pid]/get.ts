import { and, eq } from "drizzle-orm"

export default defineAuthHandler(async (event) => {
  const db = event.context.db
  const reqUserId = event.context.user?.id
  const projectId = +(getRouterParam(event, 'pid') ?? -1)

  const [queryMembership] = await db.select()
    .from(tables.projectMemberships)
    .where(and(
      eq(tables.projectMemberships.userId, reqUserId),
      eq(tables.projectMemberships.projectId, projectId)
    ))
    .limit(1)

  if (!queryMembership) {
    return createError(ERR_RESPONSE_PROJECT_UNAUTHORIZED_ACCESS)
  }

  const [queryProject] = await db.select()
    .from(tables.projects)
    .where(eq(tables.projects.id, projectId))
    .limit(1)

  return queryProject
})
