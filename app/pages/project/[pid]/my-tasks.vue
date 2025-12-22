<template>
  <div>
    My Tasks
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'app'
})
</script>
