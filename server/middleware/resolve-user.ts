export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event)

    if (user?.email) {
      event.context.user = user
    }
  } catch (err) {
    console.error(err)
  }
})
