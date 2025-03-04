export default defineAuthEventHandler(async (event) => {
  const tid = getRouterParam(event, 'tid')
  
  const attachments = await useDrizzle()
    .select()
    .from(tables.taskAttachments)
    .where(eq(tables.taskAttachments.taskId, tid))

  return {
    success: true,
    data: attachments
  }
})
