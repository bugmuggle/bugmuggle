<template>
  <div class="w-full flex flex-col items-start justify-start">
    <UNavigationMenu class="w-full" orientation="vertical" :items="menuItems" />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const menuItems = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'My Tasks',
      icon: 'lucide:layout-list',
    },
  ],
  [
    {
      label: 'Projects',
      type: "label"
    },
    {
      label: 'Bugmuggle',
    },
  ]
])
</script>
