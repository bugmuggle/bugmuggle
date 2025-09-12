import { defineStore } from 'pinia'

export const useProject = defineStore('project', () => {
  const projects = ref<Project[]>([])

  return { projects }
})
