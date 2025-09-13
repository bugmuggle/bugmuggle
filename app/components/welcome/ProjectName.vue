<template>
  <div class="space-y-3">
    <slot name="info" />

    <UForm :disabled="misc.loading" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Name" name="name">
        <UInput v-model="state.name" size="xl" placeholder="Type your project name here" class="w-full" />
      </UFormField>

      <div class="mx-auto block w-fit !mt-6">
        <UButton :disabled="misc.loading" :loading="misc.loading" type="submit" trailing-icon="i-lucide-arrow-right" size="xl" label="Next" />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().min(1, 'Project name is required'),
})
type Schema = z.output<typeof schema>

const router = useRouter()

const misc = reactive({ loading: false })

const state = reactive<Partial<Schema>>({
  name: ''
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  misc.loading = true

  try {
    const response: Project = await $fetch('/api/projects/create', {
      method: 'POST',
      body: {
        name: event.data.name
      }
    })

    return router.replace({ path: `/` })
  } catch (error) {
    console.error(error)
  } finally {
    misc.loading = false
  }
}
</script>