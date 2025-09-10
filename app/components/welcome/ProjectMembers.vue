<template>
  <div class="space-y-3">
    <slot name="info" />

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="mx-auto block w-fit !mt-6">
        <UButton type="submit" size="xl" label="Complete" />
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
const state = reactive<Partial<Schema>>({
  name: ''
})

const onSubmit = () => {}
</script>
