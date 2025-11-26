<template>
  <app-view-wrapper>
    <template #pageName>
      My Tasks
    </template>

    <div class="w-full">
      <div class="w-full space-y-8 shadow rounded-lg p-6">
        <app-tables-my-tasks :tasks="tasks" />
      </div>
    </div>
  </app-view-wrapper>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app'
})

const { appTitle } = useAppConfig()

useHead({
  title: `Home - ${appTitle}`
})

const tasks = [
  {
    id: 1,
    title: "Complete UI Review",
    status: "STARTING",
    deadline: "2025-02-20T10:00:00Z",
    assignee: 10,
    createdBy: 2
  },
  {
    id: 2,
    title: "Prepare Project Documentation",
    status: "IN_PROGRESS",
    deadline: "2025-03-01T09:30:00Z",
    assignee: 10,
    createdBy: 3
  },
  {
    id: 3,
    title: "Fix Authentication Bug",
    status: "PENDING",
    deadline: "2025-02-28T17:00:00Z",
    assignee: 10,
    createdBy: 4
  },
  {
    id: 4,
    title: "Design Dashboard Layout",
    status: "COMPLETED",
    deadline: "2025-02-15T12:00:00Z",
    assignee: 10,
    createdBy: 1
  }
]
</script>
