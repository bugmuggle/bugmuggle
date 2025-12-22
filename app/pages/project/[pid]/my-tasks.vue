<template>
  <page-wrapper>
    <template #title>My Tasks</template>

    <UTable :data="[]" :columns="columns" class="flex-1" />
    <div class="flex items-center gap-3">
      <UButton
        variant="outline"
        color="neutral"
        size="sm"
        icon="lucide-plus"
      >
        Add Task
      </UButton>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  middleware: 'auth',
  layout: 'app'
})

const columns: TableColumn<any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      class: {
        th: 'w-98'
      }
    }
  },
  {
    accessorKey: 'project',
    header: 'Project',
    meta: {
      class: {
        th: 'w-48'
      }
    }
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    meta: {
      class: {
        th: 'w-48'
      }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      class: {
        th: 'w-48'
      }
    }
  }
]

const data = ref([
  {
    name: '2024-03-11T15:30:00',
    Assignee: 'paid',
    dueDate: 'james.anderson@example.com',
    stage: 594
  }
])
</script>
