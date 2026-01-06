<template>
  <UModal
    title="Create Project"
  >
    <slot />

    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Project name" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <div class="flex items-center gap-3">
          <div class="grow" />
          <UButton type="submit">
            Submit
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

const schema = z.object({
  name: z.string('Project name is required')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>
