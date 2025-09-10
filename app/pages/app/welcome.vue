<template>
  <div class="w-full max-w-xl mx-auto block py-6 px-3">
    <hero-logo class="mb-6" />

    <p class="font-medium mb-2">
      <span class="text-neutral-300 dark:text-neutral-600">Welcome!</span>
      {{ ' ' }}
      <span>{{ userData?.profile?.email || '' }}</span>
    </p>
    
    <welcome-project-name v-if="step === 1">
      <template #info>
        <p>
          Let's set up your first project! Enter a project name below and invite your friends to collaborate.
        </p>
      </template>
    </welcome-project-name>

    <welcome-project-members v-else-if="step === 2">
      <template #info>
        <p>
          Well done! Let's invite your team members to the project.
        </p>
      </template>
    </welcome-project-members>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '~/store/user';

const { userData } = useUser()
const step = ref(1)

definePageMeta({
  middleware: 'auth'
})
</script>
