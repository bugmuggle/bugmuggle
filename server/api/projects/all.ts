import { and, asc, desc, eq, gt, lt } from "drizzle-orm"

export default defineAuthHandler(async (event) => {
  const db = event.context.db
  const reqUserId = event.context.user?.id

  let { limit, offsetId, order } = getQuery(event)

  limit = +(limit ?? 50)
  offsetId = +(offsetId ?? '')

  if (!['asc', 'desc'].includes(order as string)) {
    order = 'asc'
  }

  let query: any = db.select(tables.projects as any)
    .from(tables.projects)
    .innerJoin(tables.projectMemberships, eq(tables.projectMemberships.projectId, tables.projects.id))

  if (offsetId) {
    query = query.where(
      and(
        eq(tables.projectMemberships.userId, reqUserId),
        order === 'asc'
          ? gt(tables.projects.id, offsetId)
          : lt(tables.projects.id, offsetId)
      )
    )
  } else {
    query = query.where(
      eq(tables.projectMemberships.userId, reqUserId)
    )
  }

  const queryProjects = await query
    .orderBy(
      order === 'asc'
        ? asc(tables.projects.createdAt)
        : desc(tables.projects.createdAt)
    )
    .limit(+limit)
  
  return {
    rows: queryProjects,
    totalRows: queryProjects.length,
    order,
    limit,
    offsetId
  }
})
