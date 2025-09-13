<template>
  <div class="h-[100dvh] flex items-center justify-center">
    <UIcon name="lucide:loader-circle" class="text-4xl animate-spin" />
  </div>

  <init-auth @auth="onAuth" />
</template>

<script setup lang="ts">
import { useUser } from '@/store/user'

const router = useRouter()
const storeUser = useUser()

const onAuth = (user: any) => {
  if (!user) {
    return router.replace({ path: '/signin' })
  } else {
    storeUser.userData = user
    const lastVisitedProjectId = getPrefByKey(storeUser?.userData?.pref, prefKeys.LAST_VISITED_PROJECT_ID, null)

    if (lastVisitedProjectId) {
      return router.replace({ path: `/app/${lastVisitedProjectId}/home` })
    } else {
      return router.replace({ path: '/app/1/home' })
    }
  }
}
</script>
