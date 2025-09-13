import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Project name is required')
})

export default defineAuthHandler(async (event) => {
  const raw = await readBody(event)
  const parsedBody = schema.safeParse(raw)

  if (!parsedBody.success) {
    return createError(ERR_RESPONSE_BAD_REQUSET)
  }

  const db = event.context.db
  const { name } = parsedBody.data
  const reqUserId = event.context.user.id

  const [newProject] = await db.insert(tables.projects)
    .values({ name, createdBy: reqUserId })
    .returning()


  const insertPayload: ProjectMembershipPayload = {
    type: projectMembershipTypes.ADMIN,
    userId: reqUserId,
    projectId: newProject.id,
    createdBy: reqUserId
  }

  await db.insert(tables.projectMemberships)
    .values(insertPayload as any)
    .returning()

  return newProject
})
