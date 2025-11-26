<template>
  <app-project-view-wrapper>
    <template #title>
      Project Title
    </template>
    <div class="w-full">
      <div class="w-full space-y-8 shadow rounded-lg p-6">
        <app-tables-project-tasks :tasks="tasks" />
      </div>
    </div>
  </app-project-view-wrapper>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app'
})

const tasks = [
  {
    id: 1,
    title: "API Integration",
    status: "PROGRESS",
    deadline: "2025-03-01T16:00:00Z",
    assignee: 3,
    createdBy: 1
  },
  {
    id: 2,
    title: "Frontend Design",
    status: "PENDING",
    deadline: "2025-04-15T16:00:00Z",
    assignee: 4,
    createdBy: 2
  },
  {
    id: 3,
    title: "Database Setup",
    status: "COMPLETED",
    deadline: "2025-02-20T16:00:00Z",
    assignee: 5,
    createdBy: 1
  },
  {
    id: 4,
    title: "Backend Development",
    status: "PENDING",
    deadline: "2025-05-10T16:00:00Z",
    assignee: 6,
    createdBy: 2
  }
]
</script>
