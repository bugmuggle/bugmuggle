<template>
  <div class="flex items-center h-[100dvh] gap-3 justify-center">
    <div class="w-full max-w-lg p-3 md:p-12">
      <div class="block mx-auto w-fit mb-6">
        <hero-logo />
      </div>
      <UCard variant="soft">
        <auth-socials />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'preauth'
})
</script>
