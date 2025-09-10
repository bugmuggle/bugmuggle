<template>
</template>

<script setup lang="ts">
const emits = defineEmits(['auth'])
const { fetch: fetchSession, user } = useUserSession()

const noAuth = () => emits('auth', null)

const init = async () => {
  try {
    await fetchSession()

    if (!user.value) {
      return noAuth()
    }

    const response = await $fetch('/api/init')
  } catch (err) {
    console.error(err)
    noAuth()
  }
}

onMounted(init)
</script>
