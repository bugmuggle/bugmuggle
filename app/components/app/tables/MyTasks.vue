<template>
  <UTable :data="tasks" :columns="columns" class="w-full" />
</template>

<script setup lang="ts">
import { AppStatusDropdown } from '#components'

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
    id: 'actions',
    header: 'Actions',
    cell: () =>
      h(
        UButton,
        { variant: 'subtle', label: 'Edit' },
      )
  }
])

const defaultSort = ref({ column: 'deadline', direction: 'asc' })
</script>
