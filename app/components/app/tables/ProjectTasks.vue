<template>
  <UTable :data="tasks" :columns="columns" :sort="defaultSort" class="w-full" />
</template>

<script setup lang="ts">
import { AppStatusDropdown, AppUserDropdown } from '#components'

defineProps<{
  tasks: Task[]
}>()

const columns = ref([
  { accessorKey: 'title', header: 'Title', sortable: true },
  {
    accessorKey: 'assignee',
    header: 'Assigned To',
    cell: (ctx: unknown) => {
      h(AppUserDropdown, {
        modelValue: ctx.getValue(),
        'onUpdate:modelValue': (v: number) =>
          (ctx.row.original.assignee = v)
      })
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortable: true,
    cell: (ctx: unknown) =>
      h(AppStatusDropdown, {
        modelValue: ctx.getValue(),
        'onUpdate:modelValue': (v: TaskStatus) =>
          (ctx.row.original.status = v)
      })
  },
  { accessorKey: 'deadline', header: 'Deadline', sortable: true },
  {
    id: 'actions',
    header: 'Actions',
    cell: () =>
      h(
        'button',
        { class: 'px-2 py-1 rounded bg-gray-200 hover:bg-gray-300' },
        'View'
      )
  }
])
const defaultSort = ref({ column: 'title', direction: 'asc' })
</script>
