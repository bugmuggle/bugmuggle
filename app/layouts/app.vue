<template>
  <div class="relative h-[100dvh] w-full">
    <div class="absolute top-0 bottom-0 left-0 w-64 py-3 border-r border-nuetral-100 dark:border-neutral-800 overflow-hidden">
      <app-layout-side-menu />
    </div>

    <div class="absolute top-0 right-0 left-64 h-12 px-3 border-b border-nuetral-100 dark:border-neutral-800">
      <app-layout-page-menu />
    </div>

    <div class="absolute top-12 right-0 bottom-0 left-64 overflow-y-auto">
      <slot />
    </div>
  </div>
</template>