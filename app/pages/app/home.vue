<template>
  <app-view-wrapper>
    <template #pageName>
      My Tasks
    </template>
  </app-view-wrapper>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app'
})

const { appTitle } = useAppConfig()

useHead({
  title: `Home - ${appTitle}`
})
</script>
