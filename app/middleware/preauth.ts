export default defineNuxtRouteMiddleware(async () => {
  try {
    const { user, fetch: fetchSession } = useUserSession()
    await fetchSession()

    if (user.value) {
      return navigateTo('/')
    }
  } catch (_) {}
})
