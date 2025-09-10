<template>
  <div class="flex items-start gap-3 justify-center">
    <div class="w-full max-w-sm p-3 md:p-12">
      <div class="block mx-auto w-fit mb-6">
        <hero-logo />
      </div>
      <auth-socials />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'preauth'
})
</script>
