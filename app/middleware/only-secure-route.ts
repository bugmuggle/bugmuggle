/**
 * Only use this middleware for a page that is
 * only accessable when user is LOGGED IN.
 */

export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
