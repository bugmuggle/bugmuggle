<template>
  <div class="flex items-center gap-3">
    <img :class="[sm ? 'h-5' : 'h-8', 'w-auto']" src="/svg/bugmuggle.svg" />
    <p :class="[sm ? 'text-sm' : 'text-lg', 'font-medium']">Bugmuggle</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  sm: {
    type: Boolean,
    default: false
  }
})
</script>
