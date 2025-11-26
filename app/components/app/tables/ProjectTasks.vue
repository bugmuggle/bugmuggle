<template>
  <UTable :data="tasks" :columns="columns" :sort="defaultSort" class="w-full" />
</template>

<script setup>
const props = defineProps({
  tasks: { type: Array, required: true }
})

const columns = ref([
  { accessorKey: 'title', header: 'Title', sortable: true },
  {
    accessorKey: 'assignee',
    header: 'Assigned to',
    cell: (ctx) => `User #${ctx.getValue()}`
  },
  { accessorKey: 'status', header: 'Status', sortable: true },
  { accessorKey: 'deadline', header: 'Deadline', sortable: true },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => h('div', [h('button', { class: 'u-button' }, 'View')])
  }
])
const defaultSort = ref({ column: 'title', direction: 'asc' })
</script>
