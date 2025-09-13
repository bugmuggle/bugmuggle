import { and, eq } from "drizzle-orm"

export default defineAuthHandler(async (event) => {
  const projectId = +(getRouterParam(event, 'pid') ?? -1)
  const workItemId = +(getRouterParam(event, 'wid') ?? -1)
  const reqUserId = event.context.user?.id

  const db = event.context.db

  if (!(await verifyAccessToProject(db, reqUserId, projectId)).success) {
    return createError(ERR_RESPONSE_PROJECT_UNAUTHORIZED_ACCESS)
  }

  const [queryWorkItem] = await db.select()
    .from(tables.workItems)
    .where(and(
      eq(tables.workItems.projectId, projectId),
      eq(tables.workItems.id, workItemId)
    ))

  if (!queryWorkItem) {
    return createError(ERR_RESPONSE_WORKITEM_NOT_FOUND)
  }

  await db.delete(tables.workItems)
    .where(eq(tables.workItems.id, queryWorkItem.id))

  return queryWorkItem
})
