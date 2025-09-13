export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event)

    if ((user as any)?.email) {
      event.context.user = user as { id: number, email: string }
    }
  } catch (err) {
    console.error(err)
  }
})
