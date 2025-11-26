<template>
  <UTable :data="tasks" :columns="columns" class="w-full" />
</template>

<script setup lang="ts">
import { AppStatusDropdown, AppUserDropdown } from '#components'

defineProps<{
  tasks: Task[]
}>()

const UButton = resolveComponent('UButton')

const columns = ref([
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
        onClick: () => column.toggleSorting(isSorted === 'asc')
      })
    },
    sortable: true
  },
  {
    accessorKey: 'assignee',
    header: 'Assigned To',
    cell: (ctx: any) =>
      h(AppUserDropdown, {
        modelValue: ctx.getValue(),
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
        onClick: () => column.toggleSorting(isSorted === 'asc')
      })
    },
    sortable: true,
    cell: (ctx: any) =>
      h(AppStatusDropdown, {
        modelValue: ctx.getValue(),
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
        onClick: () => column.toggleSorting(isSorted === 'asc')
      })
    },
    sortable: true
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () =>
      h(UButton, { variant: 'subtle', label: 'View' })
  }
])
</script>
