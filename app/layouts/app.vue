<template>
  <div class="relative h-screen w-full overflow-hidden flex bg-zinc-50 dark:bg-zinc-950">
    <!-- Sidebar -->
    <aside class="w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div class="p-6">
        <LogoHero />
      </div>

      <nav class="flex-1 px-4 space-y-1 overflow-y-auto">
        <UNavigationMenu
          orientation="vertical"
          :items="mainNavItems"
          class="w-full"
        />
        
        <div class="pt-6 pb-2 px-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Recent Projects
        </div>
        
        <UNavigationMenu
          orientation="vertical"
          :items="projectsNavItems"
          class="w-full"
        />
      </nav>

      <div class="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
        <UNavigationMenu
          orientation="vertical"
          :items="footerNavItems"
          class="w-full"
        />
        
        <div v-if="user" class="px-3 py-2 flex items-center gap-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
          <UAvatar
            :src="user.avatar"
            :alt="user.name"
            size="sm"
            class="ring-2 ring-white dark:ring-zinc-900"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {{ user.name }}
            </p>
            <p class="text-xs text-zinc-500 truncate">
              {{ user.email }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-hidden relative bg-white dark:bg-neutral-900">
      <div class="h-full">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession()

const route = useRoute()
const pid = computed(() => route.params.pid)

const mainNavItems = [
  [
    {
      label: 'My tasks',
      icon: 'i-lucide-check-square',
      to: `/project/${pid.value}/my-tasks`
    }
  ]
]

const projectsNavItems = computed(() => [
  [
    {
      label: 'Bugmuggle Core',
      to: `/project/${pid.value}/home`,
      color: 'primary' as const
    },
    {
      label: 'Infrastructure',
      to: `/project/${pid.value}/home1`
    },
    {
      label: 'Mobile App',
      to: `/project/${pid.value}/home2`
    }
  ]
])

const footerNavItems = computed(() => [
  [
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings'
    },
    {
      label: 'About',
      icon: 'i-lucide-info',
      to: '/about'
    },
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onClick: async () => {
        await clear()
        await navigateTo('/login')
      }
    }
  ]
])
</script>
