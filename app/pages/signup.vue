<template>
  <div class="h-[100dvh] flex flex-col items-center justify-start md:justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      {{ misc.loading }}
      <UAlert
        v-if="misc.errmsg"
        color="error"
        variant="subtle"
        title="Failed to create account"
        :description="misc.errmsg"
        icon="lucide:badge-x"
      />
      <UAuthForm
        :schema="schema"
        title="Setup Admin Account"
        :disabled="misc.loading"
        :loading="misc.loading"
        description="Enter your credentials to create your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  middleware: 'only-public-route'
})

const toast = useToast()
const { loggedIn, fetch: fetchSession } = useUserSession()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    label: 'Create Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  },
  {
    name: 'password2',
    label: 'Verify Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  }
]

const misc = reactive({
  loading: true,
  errmsg: ''
})

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Must be at least 8 characters'),
  password2: z.string()
}).refine((data) => data.password === data.password2, {
  message: 'Passwords do not match',
  path: ['password2']
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('here::', payload.data)
  misc.errmsg = ''
  misc.loading = true

  $fetch('/api/auth/setup', {
    method: 'POST',
    body: payload.data
  })
    .then(async () => {
      await fetchSession()
      if (loggedIn.value) {
        return navigateTo('/app/home')
      }
    })
    .catch((error) => {
      console.error(error)
      misc.errmsg = error.response.statusText
    })
    .finally(() => {
      misc.loading = false
    })
    
}

onMounted(() => {
  misc.errmsg = ''
  misc.loading = true

  $fetch('/api/app/get')
    .then((res) => {
      if (res.hasAdmin) {
        return navigateTo('/login')
      }
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      misc.loading = false
    })
})
</script>
