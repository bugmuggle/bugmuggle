import { defineStore } from 'pinia'
import { format } from "date-fns"
import { useAuthStore } from './auth'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([])
  const assignees = ref([])
  const authStore = useAuthStore()

  const fetchTasks = async (cid) => {
    const response = await $fetch(`/api/channel/${cid}/tasks/all`)
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

    const resolver = response.data.map(task =>
      $fetch(`/api/channel/${task.channelId}/tasks/${task.id}/assignments/get`),
    )

    const assignments = (await Promise.allSettled(resolver))
      .filter(x => x.status === 'fulfilled')
      .map(x => x.value.data)
      .flat()

    assignments.forEach((newAssignee) => {
      const existingIndex = assignees.value.findIndex(
        a => a.taskId === newAssignee.taskId && a.userId === newAssignee.userId
      )

      if (existingIndex === -1) {
        assignees.value.push(newAssignee)
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

  return { tasks, myTasks, assignees, fetchTasks, fetchMyTasks, createTask, updateTaskOrders, updateTask, getTask, updateTaskAssignees, getTasksByChannelId }
})
