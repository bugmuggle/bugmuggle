<template>
  <div class="px-3 flex flex-col items-start gap-3 h-full">
    <hero-logo sm class="mb-3 p-1" />

    <UNavigationMenu :items="mainMenu" class="w-full" orientation="vertical" />

    <UButton variant="subtle" icon="i-lucide-plus" block label="Create Project" />

    <UInput icon="i-lucide-search" class="w-full" placeholder="Search projects ..." />

    <div class="relative w-full grow overflow-y-auto border-y border-neutral-100 dark:border-neutral-800 py-2">
      <UNavigationMenu :items="projects" class="w-full" orientation="vertical" />
    </div>

    <UNavigationMenu :items="otherMenu" class="w-full" orientation="vertical" />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const projects = ref<NavigationMenuItem[][]>([
  [
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project A' },
    { label: 'Project B' }
  ]
])

const mainMenu = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'My Work Items',
      icon: 'i-lucide-user-star'
    }
  ]
])

const otherMenu = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Settings',
      icon: 'i-lucide-settings'
    },
    {
      label: 'About',
      icon: 'i-lucide-info'
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out'
    }
  ]
])
</script>
