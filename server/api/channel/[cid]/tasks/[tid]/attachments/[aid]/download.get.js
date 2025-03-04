import { promises as fs } from 'node:fs'

export default defineAuthEventHandler(async (event) => {
  const aid = getRouterParam(event, 'aid')
  
  const attachment = await useDrizzle()
    .select()
    .from(tables.taskAttachments)
    .where(eq(tables.taskAttachments.id, aid))
    .get()

  const filePath = `${process.cwd()}/${attachment.filePath}`
  if (!await fs.access(filePath).then(() => true).catch(() => false)) {
    throw createError({ statusCode: 404, message: 'File not found' })
  }
  
  const fileData = await fs.readFile(filePath)
  
  setHeaders(event, {
    'Content-Type': attachment.fileType,
    'Content-Disposition': `attachment; filename="${attachment.fileName}"`
  })

  return fileData
})
