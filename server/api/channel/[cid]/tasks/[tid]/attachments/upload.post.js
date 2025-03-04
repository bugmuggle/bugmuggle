import { promises as fs } from 'node:fs'

export default defineAuthEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file')
    
    // Validate file exists
    if (!file) {
      throw createError({ statusCode: 400, message: 'Invalid file upload' })
    }

    const tid = getRouterParam(event, 'tid')
    const githubId = (await getUserSession(event)).user.githubId
    const user = await getUserByGithubId(githubId)

    const uploadDir = `./.bugmuggle/uploads`
    await fs.mkdir(uploadDir, { recursive: true })

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const filePath = `${uploadDir}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    await fs.writeFile(filePath, Buffer.from(arrayBuffer))

    const db = useDrizzle()
    const attachment = await db.insert(tables.taskAttachments).values({
      taskId: tid,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      filePath,
      uploadedBy: user.id,
      createdAt: new Date()
    }).returning()

    return {
      success: true,
      data: attachment[0]
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error processing file upload',
      cause: error 
    })
  }
})
