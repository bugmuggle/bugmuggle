<template>
  <UTable :data="tasks" :columns="columns" :sort="defaultSort" class="w-full" />
</template>

<script setup lang="ts">
import { AppStatusDropdown } from '#components'

defineProps<{
  tasks: Task[]
}>()

const UButton = resolveComponent('UButton')

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
        UButton,
        { variant: 'subtle', label: 'Edit' },
      )
  }
])

const defaultSort = ref({ column: 'deadline', direction: 'asc' })
</script>
