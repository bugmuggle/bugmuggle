<template>
  <div class="h-[100dvh] flex flex-col gap-3 items-center justify-center">
    <NuxtImg
      src="/logo.png"
      alt="bugmuggle logo"
      width="48"
      height="48"
    />

    <UProgress class="w-full max-w-24" size="sm" />
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  $fetch('/api/info')
    .then((res) => {
      if (res.admin) {
        return navigateTo({ path: '/home' })
      } else {
        return navigateTo({ path: '/admin/setup' })
      }
    })
})
</script>
