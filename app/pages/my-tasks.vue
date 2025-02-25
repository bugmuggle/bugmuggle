<template>
  <NuxtLayout name="app">
    <TaskPageWrapper ref="refTaskPageWrapper">
      <template #header>
        <div class="flex items-center h-full gap-3">
          <p class="text-sm font-medium">
            My Tasks
          </p>
          <UButton icon="i-heroicons-arrow-path" size="xs" color="gray" square variant="ghost"
            :class="{ 'hover:!bg-transparent animate-spin': isFetching }" @click="refreshTasks()" />
        </div>
      </template>

      <template #content>
        <div class="space-y-3">
          <tasks-list v-model="tasks" :readonly="true" @click:task="(id) => refTaskPageWrapper.openTaskView(id)" />
        </div>
      </template>
    </TaskPageWrapper>
  </NuxtLayout>
</template>

<script setup>
import { useTaskStore } from '~/store/task'

definePageMeta({
  middleware: 'auth',
})

useHead({
  title: 'My Tasks | Bugmuggle',
})

const taskStore = useTaskStore()
const tasks = ref([])
const isFetching = ref(false)
const refTaskPageWrapper = ref(null)

const refreshTasks = async () => {
  isFetching.value = true
  try {
    await taskStore.fetchMyTasks()
    tasks.value = taskStore.myTasks
    console.log(tasks.value)
  }
  finally {
    isFetching.value = false
  }
}

onMounted(() => {
  refTaskPageWrapper.value.closeTaskView()
  refreshTasks()
})
</script>
