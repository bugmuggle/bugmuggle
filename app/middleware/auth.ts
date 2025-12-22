export default defineNuxtRouteMiddleware(async () => {
  const { fetch: fetchUserSession, user } = useUserSession()

  await fetchUserSession()
  if (!user.value?.id) {
    return navigateTo({ path: '/login' })
  }

  return
})