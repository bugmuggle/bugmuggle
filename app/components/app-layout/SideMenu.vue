<template>
  <div class="px-3 flex flex-col items-start gap-3 h-full">
    <hero-logo sm class="mb-3 p-1" />

    <UNavigationMenu :items="mainMenu" class="w-full" orientation="vertical" />

    <UButton variant="subtle" icon="i-lucide-plus" block label="Create Project" @click="onClickCreateProject" />

    <UInput v-model="misc.search" icon="i-lucide-search" class="w-full" placeholder="Search projects ..." />

    <div class="relative w-full grow overflow-y-auto border-y border-neutral-100 dark:border-neutral-800 py-2">
      <div class="z-10 sticky top-2 mb-6">
        <UAlert v-if="misc.search" variant="subtle" color="neutral">
          <template #description>
            <div>
              You are searching for "{{ misc.search }}".
            </div>
            <button class="text-primary mt-1 text-sm" @click="() => misc.search = ''">Clear</button>
          </template>
        </UAlert>
      </div>
      <UNavigationMenu :items="projects" class="w-full" orientation="vertical" />
    </div>

    <UNavigationMenu :items="otherMenu" class="w-full" orientation="vertical" />
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const misc = reactive({
  search: ''
})
const pid = computed(() => +(route.params.pid ?? -1))
const { data, refresh } = useFetch<ProjectsListResponse>('/api/projects/all?limit=1000')

const projects = computed<NavigationMenuItem[]>(() => {
  const list = (data.value?.rows || []).map(x => ({
    label: x.name,
    active: x.id === pid.value,
    to: `/app/${x.id}/home`
  }))

  return list.filter((x: NavigationMenuItem) => misc.search.length
    ? x.active ? true : (x.label ?? '').toLowerCase().includes(misc.search)
    : true
  )
})

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

const onClickCreateProject = () => {
  $fetch('/api/projects/create', {
    method: 'POST',
    body: {
      name: nanoid()
    }
  })
    .then(() => {
      refresh()
    })
}
</script>
