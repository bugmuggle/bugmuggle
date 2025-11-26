<template>
  <div class="relative h-[100dvh] w-full">
    <div class="absolute top-0 bottom-0 left-0 w-64">
      <app-sidebar class="px-3 py-2" />
    </div>
    <div class="absolute top-0 right-0 bottom-0 left-64">
      <slot />
    </div>
  </div>
</template>
