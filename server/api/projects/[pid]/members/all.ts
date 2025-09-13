import { and, asc, desc, eq, gt, lt } from "drizzle-orm"

export default defineAuthHandler(async (event) => {
  const db = event.context.db
  const projectId = +(getRouterParam(event, 'pid') ?? -1)
  const reqUserId = event.context.user?.id

  let { limit, offsetId, order } = getQuery(event)

  limit = +(limit ?? 50)
  offsetId = +(offsetId ?? '')

  if (!['asc', 'desc'].includes(order as string)) {
    order = 'asc'
  }

  let query: any = db.select(tables.users as any)
    .from(tables.users)
    .innerJoin(tables.projectMemberships, eq(tables.projectMemberships.userId, tables.users.id))

  if (offsetId) {
    query = query.where(
      and(
        eq(tables.projectMemberships.projectId, projectId),
        order === 'asc'
          ? gt(tables.users.id, offsetId)
          : lt(tables.users.id, offsetId)
      )
    )
  } else {
    query = query.where(
      eq(tables.projectMemberships.projectId, projectId)
    )
  }

  const queryMembers = await query
    .orderBy(
      order === 'asc'
        ? asc(tables.users.createdAt)
        : desc(tables.users.createdAt)
    )
    .limit(+limit)
  
  return {
    rows: queryMembers,
    totalRows: queryMembers.length,
    order,
    limit,
    offsetId
  }
})
