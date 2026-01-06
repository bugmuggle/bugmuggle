export const useProjects = async () => {
  const {
    data: projects
  } = await useAsyncData(
    'projects',
    () => $fetch('/api/project/projects')
  )

  return { projects }
}
