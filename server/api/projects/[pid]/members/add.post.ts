import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const schema = z.object({
  userId: z.number().min(1, 'User id is missing'),
  type: z.string().optional()
})

export default defineAuthHandler(async (event) => {
  const raw = await readBody(event)
  const parsedBody = schema.safeParse(raw)
  const reqUserId = event.context.user?.id
  const projectId = +(getRouterParam(event, 'pid') ?? -1)

  if (!parsedBody.success) {
    return createError(ERR_RESPONSE_BAD_REQUSET)
  }

  const { userId, type: membershipType } = parsedBody.data

  const db = useDrizzle()

  const [queryMembership] = await db.select()
    .from(tables.projectMemberships)
    .where(and(
      eq(tables.projectMemberships.projectId, projectId),
      eq(tables.projectMemberships.userId, reqUserId),
      eq(tables.projectMemberships.type, projectMembershipTypes.ADMIN)
    ))
    .limit(1)

  if (!queryMembership) {
    return createError(ERR_RESPONSE_PROJECT_UNAUTHORIZED_ACCESS)
  }

  const [queryExistingMembership] = await db.select()
    .from(tables.projectMemberships)
    .where(and(
      eq(tables.projectMemberships.projectId, projectId),
      eq(tables.projectMemberships.userId, userId)
    ))
    .limit(1)

  if (queryExistingMembership) {
    return createError(ERR_RESPONSE_PROJECT_ALREADY_MEMBER)
  }

  const insertPayload: ProjectMembershipPayload = { userId, projectId }

  if (membershipType && Object.values(projectMembershipTypes).findIndex(x => x === membershipType) > -1) {
    insertPayload['type'] = membershipType
  }

  const [newMembership] = await db.insert(tables.projectMemberships)
    .values(insertPayload as any)
    .returning()
  
  return newMembership
})
