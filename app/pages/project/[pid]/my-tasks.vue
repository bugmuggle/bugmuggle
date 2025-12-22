<template>
  <page-wrapper>
    <template #title>My Tasks</template>

    <task-table />
  </page-wrapper>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'app'
})
</script>
