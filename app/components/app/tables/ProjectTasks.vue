<template>
  <UTable :data="tasks" :columns="columns" :sort="defaultSort" class="w-full" />
</template>

<script setup lang="ts">
defineProps<{
  tasks: Task[]
}>()

const users: UserOption[] = [
  { id: 1, name: 'John Doe', avatar: '/avatars/john.png' },
  { id: 2, name: 'Sarah Lee', avatar: '/avatars/sarah.png' },
  { id: 3, name: 'Mike Brown', avatar: '/avatars/mike.png' },
  { id: 4, name: 'Emily Davis', avatar: '/avatars/emily.png' }
];

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
  {
    accessorKey: 'assignee',
    header: 'Assigned To',
    cell: (ctx: unknown) => {
      const user = users.find((u) => u.id === ctx.getValue())
      return h(
        UDropdownMenu,
        {
          items: users.map((u) => ({
            label: u.name,
            icon: () => h('img', { src: u.avatar, class: 'w-4 h-4 rounded-full' }),
            click: () => (ctx.row.original.assignee = u.id)
          }))
        },
        {
          default: () =>
            h('div', { class: 'flex items-center gap-2 cursor-pointer' }, [
              h('img', { src: user?.avatar, class: 'w-6 h-6 rounded-full' }),
              h('span', {}, user?.name ?? 'Unknown')
            ])
        }
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortable: true,
    cell: (ctx: unknown) =>
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
