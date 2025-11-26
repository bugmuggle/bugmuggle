<template>
  <UTable :data="tasks" :columns="columns" :sort="defaultSort" class="w-full" />
</template>

<script setup lang="ts">
defineProps<{
  tasks: Task[]
}>()

const statusColors: Record<TaskStatus, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  PROGRESS: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  BLOCKED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-red-200 text-red-800'
}

const statusOptions: TaskStatus[] = [
  'COMPLETED',
  'PROGRESS',
  'PENDING',
  'BLOCKED',
  'CANCELLED'
]

const UDropdownMenu = resolveComponent('UDropdownMenu');

const columns = ref([
  { accessorKey: 'title', header: 'Title', sortable: true },
  { accessorKey: 'deadline', header: 'Deadline', sortable: true },
  {
    accessorKey: 'status',
    header: 'Status',
    sortable: true,
    cell: (ctx: unknown) =>
      h(
        'div',
        { class: 'flex justify-center' },
        h(
          UDropdownMenu,
          {
            items: statusOptions.map((s) => ({
              label: s,
              click: () => (ctx.row.original.status = s)
            }))
          },
          {
            default: () =>
              h(
                'span',
                {
                  class:
                    'px-3 py-1 rounded text-sm cursor-pointer ' +
                    statusColors[ctx.getValue()]
                },
                ctx.getValue()
              )
          }
        )
      )
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
