import { useUser } from "~/store/user"

export default defineNuxtRouteMiddleware(() => {
  const { userData } = useUser()
  const { user } = useUserSession()

  if (!user.value || !userData?.profile?.email) {
    return navigateTo('/')
  }
})
