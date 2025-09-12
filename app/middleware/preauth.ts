export default defineNuxtRouteMiddleware(async () => {
  try {
    const { user, fetch: fetchSession } = useUserSession()
    await fetchSession()

    console.log(user)

    if (user.value) {
      return navigateTo('/')
    }
  } catch (_) {}
})
