import { defineStore } from 'pinia'
import { format } from "date-fns"
import { useAuthStore } from './auth'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([])
  const assignees = ref([])
  const authStore = useAuthStore()

  const fetchTaskById = async (cid, tid) => {
    const taskResponse = await $fetch(`/api/channel/${cid}/tasks/${tid}/get`)
    const taskAssignResponse =  await $fetch(`/api/channel/${cid}/tasks/${tid}/assignments/get`)

    const ti_task = tasks.value.findIndex(t => t?.id === tid)

    if (ti_task > -1) {
      tasks.value[ti_task] = taskResponse.data
    } else {
      tasks.value.push(taskResponse.data)
    }

    assignees.value = taskAssignResponse.data.flat()

    return taskResponse.data
  }

  const fetchTasks = async (cid, { archived = false } = {}) => {
    const response = await $fetch(`/api/channel/${cid}/tasks/all`, {
      query: { archived }
    })

    tasks.value = response.data

    const resolver = []
    response.data.forEach(task => {
      resolver.push(
        $fetch(`/api/channel/${cid}/tasks/${task.id}/assignments/get`)
      )
    })

    const assignments = (await Promise.allSettled(resolver))
      .filter(x => x.status === 'fulfilled')
      .map(x => x.value.data)

    assignees.value = assignments.flat()

    return response
  }

  const createTask = async (cid, name, description, priority) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/create`, {
      method: 'POST',
      body: { name, description, priority },
    })

    if (res.success) {
      tasks.value.push(res.data.task)
    }
  }

  const updateTaskOrders = async (cid, orderString) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/update-task-orders`, {
      method: 'POST',
      body: { orderString },
    })
  }

  const updateTask = async (cid, taskId, updates) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/${taskId}/update`, {
      method: 'POST',
      body: { updates },
    })

    if (res.success) {
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = res.data
      }
    }
  }

  const deleteTask = async (cid, taskId) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/${taskId}/delete`, {
      method: 'DELETE',
    })

    if (res.success) {
      const ti = tasks.value.findIndex(t => t.id === +taskId)
      console.log('deleteTask::ti', ti, +taskId)
      if (ti !== -1) {
        tasks.value.splice(ti, 1)
      }
    }

    return res.data
  }

  const getTask = (taskId) => {
    return tasks.value.find(t => t.id === taskId)
  }

  const updateTaskAssignees = async (cid, taskId, assigneeIds) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/${taskId}/assignments/assign`, {
      method: 'POST',
      body: { assigneeIds },
    })

    if (res.success) {
      // Clear existing assignees by taskId
      assignees.value = assignees.value.filter(a => a.taskId !== taskId)

      const queryAssignees = await $fetch(`/api/channel/${cid}/tasks/${taskId}/assignments/get`)

      // Add new assignees
      assignees.value.push(...queryAssignees.data.flat())
    }

    return true
  }

  const fetchMyTasks = async () => {
    const response = await $fetch('/api/user/my-tasks')

    response.data.forEach((newTask) => {
      const targetIndex = tasks.value.findIndex(task => task.id === newTask.id)
      if (targetIndex > -1) {
        tasks.value[targetIndex] = newTask
      } else {
        tasks.value.push(newTask)
      }
    })

    return response.data
  }

  const getHeroDate = (date) => {
    return date ? format(date, 'MMM d, yyyy') : null
  }

  const myTasks = computed(() =>
    tasks.value.filter(task => task.assigneeUserId === authStore.profile.id)
      .map(x => ({ ...x, dueDateHero: getHeroDate(x.dueDate) }))
  )

  const getTasksByChannelId = (channelId) => tasks.value
    .filter(x => x.channelId === +channelId)
    .sort((x, y) => x.order - y.order)
    .map(x => ({ ...x, dueDateHero: getHeroDate(x.dueDate) }))

  const uploadTaskAttachment = async (cid, tid, file) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await $fetch(`/api/channel/${cid}/tasks/${tid}/attachments/upload`, {
      method: 'POST',
      body: formData
    })

    return res.data
  }

  const downloadTaskAttachment = async (cid, tid, aid) => {
    const response = await $fetch(`/api/channel/${cid}/tasks/${tid}/attachments/${aid}/download`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(response)
    window.open(url, '_blank')
    window.URL.revokeObjectURL(url)
  }

  const fetchTaskAttachments = async (cid, tid) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/${tid}/attachments/fetch`)
    return res.data
  }

  const deleteTaskAttachment = async (cid, tid, aid) => {
    await $fetch(`/api/channel/${cid}/tasks/${tid}/attachments/${aid}/delete`, {
      method: 'DELETE'
    })
  }

  return {
    tasks,
    myTasks,
    assignees,
    fetchTaskById,
    fetchTasks,
    fetchMyTasks,
    createTask,
    deleteTask,
    updateTaskOrders, updateTask, getTask, updateTaskAssignees, getTasksByChannelId,
    uploadTaskAttachment, downloadTaskAttachment, fetchTaskAttachments, deleteTaskAttachment
  }
})
