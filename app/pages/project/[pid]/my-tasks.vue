<template>
  <page-wrapper>
    <template #title>My Tasks</template>

    hello
  </page-wrapper>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'app'
})
</script>
