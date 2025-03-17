<template>
  <NuxtLayout name="task">
    <div class="w-full max-w-screen-sm mx-auto block m-4">
      <UCard class="body">
        <template #header>
          <div class="flex items-center gap-3">
            <UButton
              icon="i-heroicons-arrow-left-20-solid"
              variant="ghost"
              color="gray"
              label="Go to channel"
              :to="`/channel/${cid}?task=${tid}`"
            />
            <div class="grow" />
          </div>
        </template>
        <div class="space-y-3">
          <p class="text-2xl font-regular">{{ task?.title }}</p>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 font-regular">Assigned to</p>
            <div class="inline-flex items-center gap-2">
              <UAvatar
                :src="assignees[0]?.githubAvatarUrl"
                :alt="assignees[0]?.githubUsername"
                size="xs"
              />
              <p class="text-sm font-regular">{{ assignees[0]?.githubUsername }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 font-regular">Status</p>
            <p class="text-sm font-regular">
              <UBadge
                class="status"
                v-if="task?.status"
                :color="
                  task?.status === 'To Do' ? 'gray' :
                  task?.status === 'In Progress' ? 'blue' :
                  task?.status === 'Pull Request' ? 'purple' :
                  task?.status === 'Testing' ? 'yellow' :
                  task?.status === 'Completed' ? 'green' :
                  task?.status === 'Blocked' ? 'red' :
                  'gray'
                "
              >
                {{ task?.status }}
              </UBadge>
              <p v-else class="text-sm text-gray-500 font-regular">No status</p>
            </p>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 font-regular">Due date</p>
            <UBadge v-if="task?.dueDate" color="gray" class="date">
              {{ format(task?.dueDate, 'd MMM, yyyy') }}
            </UBadge>
            <p v-else class="text-sm text-gray-500 font-regular">No due date</p>
          </div>

          <div class="space-y-1">
            <p class="text-sm text-gray-500 font-regular">Description</p>
            <editor ref="elEditor" readonly />
          </div>
        </div>
      </UCard>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { format } from 'date-fns'

definePageMeta({
  middleware: 'auth',
})

const elEditor = ref(null)
const tid = useRoute().params.tid
const cid = useRoute().params.cid

const task = ref(null)
const assignees = ref([])

const hasAttemptedPrint = ref(false)

const printTask = () => {
  if (hasAttemptedPrint.value) return

  window.print()
  hasAttemptedPrint.value = true
}

onMounted(async () => {
  try {
    const response = await $fetch(`/api/channel/${cid}/tasks/${tid}/get`)
    task.value = response.data
    elEditor.value.setContent(task.value.description)

    const assigneesResponse = await $fetch(`/api/channel/${cid}/tasks/${tid}/assignments/get`)
    assignees.value = assigneesResponse.data.flat()

    setTimeout(() => {
      printTask()
    }, 500)
  } catch (error) {
    console.error(error)
  }
})
</script>

<style>
@media print {
  .body {
    background-color: white !important;
    color: black !important;
    border: none !important;
  }

  .body > div:nth-child(1) {
    display: none !important;
  }

  .body > div:nth-child(2) {
    border: none !important;
  }

  .text-gray-500 {
    color: black !important;
  }

  .body .status {
    background-color: transparent !important;
    color: black !important;
  }

  .body .date {
    background-color: transparent !important;
    color: black !important;
  }
}
</style>
