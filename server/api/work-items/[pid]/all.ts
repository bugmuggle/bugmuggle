import { and, asc, desc, eq, gt, lt } from "drizzle-orm"

export default defineAuthHandler(async (event) => {
  const db = event.context.db
  const projectId = +(getRouterParam(event, 'pid') ?? -1)
  const reqUserId = event.context.user?.id

  if (!(await verifyAccessToProject(db, reqUserId, projectId)).success) {
    return createError(ERR_RESPONSE_PROJECT_UNAUTHORIZED_ACCESS)
  }

  let { limit, offsetId, order, type } = getQuery(event)

  limit = +(limit ?? 50)
  offsetId = +(offsetId ?? '')

  if (!['asc', 'desc'].includes(order as string)) {
    order = 'asc'
  }

  let query: any = db.select()
    .from(tables.workItems)

  let conditions = [
    eq(tables.workItems.projectId, projectId)
  ]

  if (offsetId) {
    conditions.push(
      order === 'asc'
        ? gt(tables.workItems.id, offsetId)
        : lt(tables.workItems.id, offsetId)
    )
  }

  if (type && (type === 'task' || type === 'bug')) {
    conditions.push(
      eq(tables.workItems.type, type)
    )
  }

  query = query.where(and(...conditions))

  const queryWorkItems = await query
    .orderBy(
      order === 'asc'
        ? asc(tables.workItems.createdAt)
        : desc(tables.workItems.createdAt)
    )
    .limit(+limit)
  
  return {
    rows: queryWorkItems,
    totalRows: queryWorkItems.length,
    order,
    limit,
    offsetId
  }
})
