import { defineStore } from 'pinia'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([])

  const fetchTasks = async (cid) => {
    const res = await $fetch(`/api/channel/${cid}/tasks/all`)
    tasks.value = res.data.tasks.sort((a, b) => a.order - b.order)

    return res
  }

  const createTask = async (cid, name, description, priority) => {
    console.log(cid, name, description, priority)
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

  return { tasks, fetchTasks, createTask, updateTaskOrders }
})
