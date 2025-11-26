<template>
  <UTable :data="tasks" :columns="columns" :sort="defaultSort" class="w-full" />
</template>

<script setup lang="ts">
import { AppStatusDropdown } from '#components'

defineProps<{
  tasks: Task[]
}>()

const columns = ref([
  { accessorKey: 'title', header: 'Title', sortable: true },
  { accessorKey: 'deadline', header: 'Deadline', sortable: true },
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
  {
    id: 'actions',
    header: 'Actions',
    cell: () =>
      h(
        'button',
        { class: 'px-2 py-1 rounded bg-gray-200 hover:bg-gray-300' },
        'Edit'
      )
  }
])

const defaultSort = ref({ column: 'deadline', direction: 'asc' })
</script>
