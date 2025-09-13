import { z } from 'zod'

const schema = z.object({
  type: z.string().optional(),
  title: z.string().min(1, 'Work item title is required'),
  description: z.string().optional()
})

export default defineAuthHandler(async (event) => {
  const raw = await readBody(event)
  const parsedBody = schema.safeParse(raw)

  if (!parsedBody.success) {
    return createError(ERR_RESPONSE_BAD_REQUSET)
  }

  const db = event.context.db
  const { type, title, description } = parsedBody.data
  const projectId = +(getRouterParam(event, 'pid') ?? -1)
  const reqUserId = event.context.user.id

  if (!(await verifyAccessToProject(db, reqUserId, projectId)).success) {
    return createError(ERR_RESPONSE_PROJECT_UNAUTHORIZED_ACCESS)
  }

  const payload = {
    title,
    description: description ?? '',
    status: workItemStatus.todo,
    createdBy: reqUserId,
    projectId
  }

  if (type && type in workItemTypes) {
    payload['type'] = type
  } 

  const [newWorkItem] = await db.insert(tables.workItems)
    .values(payload)
    .returning()

  return newWorkItem
})
