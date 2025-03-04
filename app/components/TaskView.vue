<template>
  <div class="space-y-3">
    <div class="flex items-center gap-1 h-16 px-3">
      <UButton icon="i-heroicons-x-mark" size="sm" color="gray" square variant="ghost" @click="closeTaskView" />

      <div class="grow" />

      <UButton
        :icon="
          isCopiedTaskUrl
            ? 'i-heroicons-check-circle'
            : 'i-heroicons-clipboard-document-list'
        "
        size="sm"
        square
        color="white"
        variant="ghost"
        @click="onClickCopyTaskUrl"
      />

      <UButton
        icon="i-heroicons-arrow-top-right-on-square"
        size="sm"
        color="white"
        variant="ghost"
        square
        @click="openTaskInNewTab"
      />

      <UDropdown :items="taskMenu" :popper="{ placement: 'bottom-start' }">
        <UButton
          icon="i-heroicons-ellipsis-vertical"
          size="sm"
          color="white"
          variant="ghost"
          square
          @click="() => {}"
        />
      </UDropdown>
    </div>
    <div v-if="task" class="px-3 space-y-3">
      <UAlert
        v-if="task.archived"
        :actions="[
          { variant: 'solid', color: 'primary', label: 'Unarchive', click: onUnarchiveTask }
        ]"
        icon="i-heroicons-archive-box-20-solid"
        color="yellow"
        variant="outline"
        title="Archived"
        description="This task is archived. You can unarchive it by clicking the button below."
      />

      <UTextarea v-model="task.title" size="xl" :ui="{
        variant: {
          none: 'focus:ring-1'
        },
        size: {
          xl: 'text-2xl h-fit'
        }
      }" autoresize placeholder="Enter task title" variant="none" />

      <div class="grid grid-cols-12 items-center gap-3 px-4">
        <div class="col-span-2">
          <p class="text-sm text-gray-500 font-regular">Assignee</p>
        </div>
        <div class="col-span-10">
          <USelectMenu v-model="selectedAssignee" :loading="loadingSelectAssignee" :multiple="false"
            :searchable="searchAssignee" :ui="{
              variant: {
                none: 'focus:ring-1'
              }
            }" placeholder="Search for a user..." option-attribute="githubUsername" trailing variant="none" by="id">
            <template #label>
              <div v-if="selectedAssignee" class="flex items-center gap-2">
                <UAvatar :src="selectedAssignee?.githubAvatarUrl" :alt="selectedAssignee?.githubUsername" size="xs" />
                <p class="text-sm text-gray-500">{{ selectedAssignee?.githubUsername }}</p>
              </div>
              <div v-else>
                <p class="text-sm text-gray-500">No assignee</p>
              </div>
            </template>
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <img :src="option.githubAvatarUrl" class="w-4 h-4 rounded-full" />
                <p>{{ option.githubUsername }}</p>
              </div>
            </template>
          </USelectMenu>
        </div>
      </div>

      <div class="grid grid-cols-12 items-center gap-3 px-4">
        <div class="col-span-2">
          <p class="text-sm text-gray-500 font-regular">Status</p>
        </div>
        <div class="col-span-10">
          <USelectMenu v-model="selectedStatus" :options="[
            'To Do',
            'In Progress',
            'Pull Request',
            'Testing',
            'Completed',
            'Blocked',
            'Cancelled'
          ]" :ui="{
            variant: {
              none: 'focus:ring-1'
            }
          }" variant="none" />
        </div>
      </div>

      <div class="grid grid-cols-12 items-center gap-3 px-4">
        <div class="col-span-2">
          <p class="text-sm text-gray-500 font-regular">Due date</p>
        </div>
        <div class="col-span-10">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" variant="ghost" color="gray"
              :label="selectedDueDate ? format(selectedDueDate, 'd MMM, yyy') : 'Select due date'" />

            <template #panel="{ close }">
              <DatePicker v-model="selectedDueDate" :attributes="dateAttributes" is-required @close="close" />
            </template>
          </UPopover>
        </div>
      </div>

      <div class="px-4 space-y-1">
        <div class="h-2" />
        <p class="text-sm text-gray-500 font-regular">Description</p>
        <editor ref="elEditor" v-model="editDescription" />
      </div>

      <div class="px-4 space-y-1 mt-4">
        <p class="text-sm text-gray-500 font-regular">Attachments</p>
        
        <div class="space-y-2">
          <UInput
            ref="refFileInput"
            type="file"
            multiple
            @change="(e) => onFileUpload(e)"
          />

          <div v-for="attachment in attachments" :key="attachment.id" 
               class="flex items-center justify-between p-2 border border-gray-700 rounded-md">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-paper-clip" />
              <span class="text-sm">{{ attachment.fileName }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-arrow-down-tray"
                size="xs"
                color="gray"
                variant="ghost"
                @click="downloadAttachment(attachment.id)"
              />
              <UButton
                icon="i-heroicons-trash"
                size="xs"
                color="red"
                variant="ghost"
                @click="deleteAttachment(attachment.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="h-24" />
    </div>
  </div>
</template>

<script setup>
import { useDebounceFn, useClipboard } from '@vueuse/core'
import { format } from 'date-fns'
import { useTaskStore } from '@/store/task'
import { useChannelStore } from '@/store/channel'
const taskStore = useTaskStore()
const channelStore = useChannelStore()

const props = defineProps({
  taskId: {
    type: Number,
    default: () => { return -1 }
  },
  cid: {
    type: String,
    default: () => { return '' }
  }
})

const emits = defineEmits(['close'])

const { copy: copyTaskUrl, copied: isCopiedTaskUrl } = useClipboard()
const onClickCopyTaskUrl = () => {
  copyTaskUrl(`${window.location.origin}/channel/${props.cid}/task/${props.taskId}`)
}

const selectedAssignee = ref(null)
const selectedStatus = ref(null)
const selectedDueDate = ref(null)
const editDescription = ref('')
const loadingSelectAssignee = ref(false)
const isReady = ref(true)
const elEditor = ref(null)
const assignees = computed(() => {
  return taskStore.assignees.filter(a => a.taskId === props.taskId)
})

const onArchiveTask = () => {
  if (!task.value.archived) {
    taskStore.updateTask(props.cid, props.taskId, { archived: true })
  }
}

const onDeleteTask = () => {
  taskStore.deleteTask(props.cid, props.taskId)
    .then(() => {
      closeTaskView()
    })
    .catch((error) => {
      console.error(error)
    })
}

const taskMenu = [
  [
    {
      label: 'Archive',
      icon: 'i-heroicons-archive-box-20-solid',
      click: onArchiveTask
    }
  ],
  [
    {
      label: 'Delete Permanently',
      icon: 'i-heroicons-trash-20-solid',
      iconClass: 'bg-red-400',
      class: '!text-red-400',
      click: onDeleteTask
    }
  ]
]

const dateAttributes = [
  {
    dot: "green",
    dates: new Date()
  }
]

const task = computed({
  get: () => {
    return taskStore.getTask(+props.taskId)
  },
  set: (_) => { }
})

const onUnarchiveTask = () => {
  taskStore.updateTask(props.cid, props.taskId, { archived: false })
}

const searchAssignee = async (query) => {
  loadingSelectAssignee.value = true

  try {
    const users = await channelStore.getUsers(props.cid)
    return users.filter(user => user.githubUsername.toLowerCase().includes(query.toLowerCase()))
  } catch (error) {
    console.error(error)
  } finally {
    loadingSelectAssignee.value = false
  }
}

watch(() => props.taskId, (value) => {
  task.value = taskStore.getTask(value)
})

const attachments = ref([])

const fetchAttachments = async () => {
  try {
    const res = await taskStore.fetchTaskAttachments(props.cid, props.taskId)
    attachments.value = res
  } catch (error) {
    console.error('Error fetching attachments:', error)
  }
}

const refFileInput = ref(null)

const initAssignees = () => {
  setTimeout(async () => {
    isReady.value = false
    selectedAssignee.value = assignees.value[0]
    selectedStatus.value = task.value.status
    selectedDueDate.value = task.value.dueDate ? new Date(task.value.dueDate) : null
    editDescription.value = task.value.description
    if (elEditor.value) {
      elEditor.value.setContent(task.value.description)
    }
    
    await fetchAttachments()
    
    if (refFileInput.value) {
      refFileInput.value.input.value = null
    }
    
    nextTick(() => {
      isReady.value = true
    })
  }, 100)
}

const cleanup = () => {
  isReady.value = false
  selectedAssignee.value = null
  nextTick(() => {
    isReady.value = true
  })
}

const closeTaskView = () => {
  useRouter().push({
    query: {
      task: null,
    },
  })
  emits('close')
}

watch(selectedAssignee, (value) => {
  if (isReady.value) {
    // taskStore.updateTaskAssignees(props.cid, props.taskId, value.map(a => a.id))
    taskStore.updateTaskAssignees(props.cid, props.taskId, [value.id])
  }
})

watch(selectedStatus, (value) => {
  if (isReady.value) {
    taskStore.updateTask(props.cid, props.taskId, { status: value })
  }
})

watch(selectedDueDate, (value) => {
  if (isReady.value) {
    taskStore.updateTask(props.cid, props.taskId, { dueDate: value.toISOString() })
  }
})

const debouncedUpdateTask = useDebounceFn((value) => {
  taskStore.updateTask(props.cid, props.taskId, { description: value })
}, 1000)

watch(editDescription, (value) => {
  if (isReady.value) {
    debouncedUpdateTask(value)
  }
})

const openTaskInNewTab = () => {
  window.open(`/channel/${props.cid}/task/${props.taskId}`, '_blank')
}

const onFileUpload = async (files) => {
  if (!files.length) return

  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) { 
      console.error('File too large')
      // toast.add({ title: 'File too large', description: `${file.name} exceeds 10MB limit`, color: 'red' })
      continue
    }

    try {
      const response = await taskStore.uploadTaskAttachment(props.cid, props.taskId, file)
      attachments.value.push(response)
      // toast.add({ title: 'Upload successful', description: `${file.name} uploaded`, color: 'green' })
    } catch (error) {
      console.error('Error uploading file:', error)
      // toast.add({ title: 'Upload failed', description: `${file.name} could not be uploaded`, color: 'red' })
    }
  }
}

const downloadAttachment = async (attachmentId) => {
  await taskStore.downloadTaskAttachment(props.cid, props.taskId, attachmentId)
}

const deleteAttachment = async (attachmentId) => {
  await taskStore.deleteTaskAttachment(props.cid, props.taskId, attachmentId)
  attachments.value = attachments.value.filter(a => a.id !== attachmentId)
}

defineExpose({
  cleanup,
  initAssignees
})
</script>
