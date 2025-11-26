<template>
  <UTable :data="tasks" :columns="columns" class="w-full" />
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { AppStatusDropdown, AppUserDropdown } from '#components'

defineProps<{
  tasks: Task[]
}>()

const UButton = resolveComponent('UButton')

const columns: Ref<TableColumn<Task, unknown>[]> = ref([
  {
    accessorKey: 'title',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Title',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        ui: { leadingIcon : 'text-muted'},
        onClick: () => column.toggleSorting(isSorted === 'asc')
      })
    },
  },
  {
    accessorKey: 'assignee',
    header: 'Assigned To',
    cell: (ctx) =>
      h(AppUserDropdown, {
        modelValue: ctx.getValue() as number,
        'onUpdate:modelValue': (v: number) =>
          (ctx.row.original.assignee = v)
      })
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Status',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        ui: { leadingIcon : 'text-muted'},
        onClick: () => column.toggleSorting(isSorted === 'asc')
      })
    },
    cell: (ctx) =>
      h(AppStatusDropdown, {
        modelValue: ctx.getValue() as TaskStatus,
        'onUpdate:modelValue': (v: TaskStatus) =>
          (ctx.row.original.status = v)
      })
  },
  {
    accessorKey: 'deadline',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Deadline',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        ui: { leadingIcon : 'text-muted'},
        onClick: () => column.toggleSorting(isSorted === 'asc')
      })
    },
    cell: (ctx) => {
      const date = new Date(ctx.getValue() as string)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () =>
      h(UButton, { variant: 'subtle', label: 'View' })
  }
])
</script>
