<template>
  <UTable :data="tasks" :columns="columns" :sort="defaultSort" class="w-full" />
</template>

<script setup>
const props = defineProps({
  tasks: { type: Array, required: true }
})

const columns = ref([
  { accessorKey: 'title', header: 'Title', sortable: true },
  { accessorKey: 'deadline', header: 'Deadline', sortable: true },
  { accessorKey: 'status', header: 'Status', sortable: true },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => h('div', [h('button', { class: 'u-button' }, 'Edit')])
  }
])
const defaultSort = ref({ column: 'deadline', direction: 'asc' })
</script>
