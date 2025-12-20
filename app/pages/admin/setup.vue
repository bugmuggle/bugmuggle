<template>
  <div v-if="misc.loading" class="flex flex-col items-center justify-center h-screen">
    <UProgress class="w-full max-w-32" />
  </div>
  <div v-else class="w-full max-w-md block mx-auto py-6 space-y-6">
    <div class="flex items-center gap-3">
      <logo-hero />
    </div>
    
    <div class="space-y-2">
      <p>
        Welcome to bugmuggle. This is the first time using the app, so you must register yourself as the root admin.
      </p>
      <div class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          This token will be used to verify authorization to create admin. You will find it in the server environment, if not set <code>BUGMUGGLE_ONE_OFF_ADMIN_TOKEN</code>
        </p>
      </div>
    </div>

    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormField label="One time token" name="token" required>
        <UInput v-model="state.token" type="password" placeholder="Enter setup token" class="w-full" />
      </UFormField>

      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" type="email" placeholder="admin@example.com" class="w-full" />
      </UFormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Create Password" name="password" required>
          <UInput v-model="state.password" type="password" placeholder="••••••••" class="w-full" />
        </UFormField>

        <UFormField label="Verify Password" name="confirmPassword" required>
          <UInput v-model="state.confirmPassword" type="password" placeholder="••••••••" class="w-full" />
        </UFormField>
      </div>

      <UButton type="submit" block :loading="misc.submitting">
        Create Admin Account
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const misc = reactive({
  loading: false,
  submitting: false
})

const schema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type Schema = z.output<typeof schema>

const state = reactive({
  token: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  misc.submitting = true
  
  try {
    await $fetch('/api/admin/setup', {
      method: 'POST',
      body: {
        token: event.data.token,
        email: event.data.email,
        password: event.data.password
      }
    })
    
    toast.add({
      title: 'Success',
      description: 'Admin account created successfully',
      color: 'success'
    })
    
    // Redirect to home or index after success
    await navigateTo('/')
  } catch (error: any) {
    console.error('Failed to create admin:', error)
    toast.add({
      title: 'Setup Failed',
      description: error.data?.statusMessage || 'An unexpected error occurred. Please try again.',
      color: 'error'
    })
  } finally {
    misc.submitting = false
  }
}

const { appName } = useAppConfig()

onMounted(() => {
  // initialization logic if any
})
</script>
