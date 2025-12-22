<template>
  <div class="absolute top-0 right-0 h-12 left-0 border-b border-neutral-300 dark:border-neutral-800">
    <div class="px-3 flex items-center gap-3 h-full">
      <p class="text-sm font-medium">
        <slot name="title" />
      </p>
      <div class="grow" />

      <div class="inline-flex items-center gap-3">
        <slot name="options" />
      </div>
    </div>
  </div>

  <div class="absolute top-12 right-0 bottom-0 left-0 px-3 py-3">
    <slot />
  </div>
</template>