<template>
  <div class="relative h-[100dvh] w-full overlfow-hidden">
    <div class="z-10 absolute top-0 right-0 left-0 h-12">
      <div class="flex items-center gap-3 h-full px-3">
        <p class="text-lg font-bold">
          <slot name="pageName" />
        </p>
      </div>
    </div>
    <div class="pt-12 h-full overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
