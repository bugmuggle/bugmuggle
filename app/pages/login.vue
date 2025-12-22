<template>
  <div class="h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="flex flex-col items-center gap-2 text-center">
          <LogoHero />
          <h1 class="text-2xl font-bold tracking-tight">Login</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Welcome back! Please enter your details.
          </p>
        </div>
      </template>

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-6">
        <div class="space-y-4">
          <UFormField label="Email" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="name@example.com"
              icon="i-lucide-mail"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" name="password" required>
            <UInput
              v-model="state.password"
              type="password"
              placeholder="••••••••"
              icon="i-lucide-lock"
              class="w-full"
            />
          </UFormField>
        </div>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="loading"
          class="font-semibold"
        >
          Sign in
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-xs text-zinc-500">
          &copy; {{ new Date().getFullYear() }} Bugmuggle. All rights reserved.
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: event.data
    })
    
    toast.add({
      title: 'Success',
      description: 'You have been logged in successfully.',
      color: 'success'
    })
    
    // Redirect to home/index which handles further routing
    await navigateTo('/')
  } catch (error: any) {
    console.error('[Login]:', error)
    
    toast.add({
      title: 'Authentication Error',
      description: error.data?.statusMessage || 'Invalid email or password.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>