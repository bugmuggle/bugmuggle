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
      to: '/app/home'
    },
  ],
  [
    {
      label: 'Projects',
      type: "label"
    },
    {
      label: 'Bugmuggle',
      to: '/app/project/1'
    },
  ],
  [
    {
      label: 'Direct Messages',
      type: "label"
    },
    {
      label: 'Kiran Sai K',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/35134207?v=4'
      }
    },
  ]
])
</script>
