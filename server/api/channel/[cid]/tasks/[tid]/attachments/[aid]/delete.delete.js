import { promises as fs } from 'node:fs'

export default defineAuthEventHandler(async (event) => {
  const aid = getRouterParam(event, 'aid')
  
  const attachment = await useDrizzle()
    .delete(tables.taskAttachments)
    .where(eq(tables.taskAttachments.id, aid))
    .returning()

  if (attachment.length > 0) {
    await fs.unlink(attachment[0].filePath).catch(console.error)
  }

  return {
    success: true,
    data: attachment[0]
  }
})
