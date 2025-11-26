<template>
  <div class="h-[100dvh] flex flex-col items-center justify-start md:justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        :disabled="misc.loading"
        :loading="misc.loading"
        description="Enter your credentials to access your account."
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

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  }, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  }
]

const misc = reactive({
  loading: true
})

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  $fetch('/api/auth/login', {
    method: 'POST',
    body: payload
  })
}

onMounted(() => {
  misc.loading = true

  $fetch('/api/app/get')
    .then((res) => {
      if (!res.hasAdmin) {
        return navigateTo('/signup')
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
