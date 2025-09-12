<template>
  <UNavigationMenu :items="menu" />
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const menu = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'List View',
      icon: 'i-lucide-layout-list'
    },
    {
      label: 'Board View',
      icon: 'i-majesticons:view-boards-line'
    }
  ],
  [
    {
      label: 'Chat',
      icon: 'i-lucide-messages-square'
    },
    {
      label: 'Members',
      icon: 'i-lucide-users'
    },
    {
      icon: 'i-lucide-ellipsis-vertical'
    }
  ]
])
</script>
