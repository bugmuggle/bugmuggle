<template>
  <UContainer class="py-10">
    <div class="flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 italic tracking-tight">My Tasks</h1>
          <p class="text-zinc-500 mt-1">You have {{ tasks.length }} tasks assigned to you</p>
        </div>
        <div class="flex gap-2">
          <UButton variant="subtle" icon="i-lucide-filter">Filter</UButton>
          <UButton icon="i-lucide-plus" class="rounded-full">New Task</UButton>
        </div>
      </div>

      <UCard class="overflow-hidden" :ui="{ body: 'p-0' }">
        <UTable :rows="tasks" :columns="columns">
          <template #title-data="{ row }">
            <div class="font-medium text-zinc-900 dark:text-zinc-100">{{ row.title }}</div>
            <div class="text-xs text-zinc-500">{{ row.project }}</div>
          </template>

          <template #status-data="{ row }">
            <UBadge :color="row.statusColor" variant="subtle" size="sm">
              {{ row.status }}
            </UBadge>
          </template>

          <template #priority-data="{ row }">
            <div class="flex items-center gap-2">
              <div :class="['w-2 h-2 rounded-full', row.priorityColor]" />
              <span class="text-sm font-medium">{{ row.priority }}</span>
            </div>
          </template>

          <template #actions-data="{ row }">
            <UDropdownMenu :items="actionItems(row)">
              <UButton variant="ghost" icon="i-lucide-more-horizontal" color="neutral" />
            </UDropdownMenu>
          </template>
        </UTable>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const columns = [
  { key: 'title', label: 'Task' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'actions', label: '' }
]

const tasks = [
  { id: 1, title: 'Fix navigation layout bug', project: 'Bugmuggle Core', status: 'In Progress', statusColor: 'warning' as const, priority: 'High', priorityColor: 'bg-red-500', dueDate: 'Today' },
  { id: 2, title: 'Implement user session flow', project: 'Bugmuggle Core', status: 'Completed', statusColor: 'success' as const, priority: 'Medium', priorityColor: 'bg-amber-500', dueDate: 'Yesterday' },
  { id: 3, title: 'Design system update', project: 'Mobile App', status: 'Todo', statusColor: 'neutral' as const, priority: 'Low', priorityColor: 'bg-blue-500', dueDate: 'Dec 24' },
  { id: 4, title: 'API Documentation', project: 'Infrastructure', status: 'Todo', statusColor: 'neutral' as const, priority: 'Medium', priorityColor: 'bg-amber-500', dueDate: 'Dec 26' }
]

const actionItems = (row: any) => [
  [
    { label: 'Edit', icon: 'i-lucide-edit' },
    { label: 'Duplicate', icon: 'i-lucide-copy' }
  ],
  [
    { label: 'Delete', icon: 'i-lucide-trash', color: 'error' as const }
  ]
]
</script>
