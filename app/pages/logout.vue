<template>
  <div>
    Please wait ....
  </div>
</template>

<script setup>
const { clear: clearSession } = useUserSession()

useHead({
  title: 'LogOut | Bugmuggle',
})

onMounted(() => {
  clearSession()
    .then(() => {
      useRouter().replace({ path: '/login' })
    })
    .catch(error => {
      console.error('TODO', error)
    })
})
</script>
