<template>
  <div class="inline-flex items-center gap-3">
    <NuxtImg src="/logo.png" width="32" height="32" />
    <p class="text-lg">{{ appName }}</p>
  </div>
</template>

<script setup lang="ts">
  const { appName } = useAppConfig()
</script>
