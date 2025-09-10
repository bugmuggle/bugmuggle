<template>
  <div class="h-[100dvh] flex items-center justify-center">
    <UIcon name="lucide:loader-circle" class="text-4xl animate-spin" />
  </div>

  <init-auth @auth="onAuth" />
</template>

<script setup lang="ts">
const router = useRouter()

const onAuth = (user) => {
  if (!user) {
    return router.replace({ path: '/auth' })
  }
}

onMounted(() => {

})
</script>
