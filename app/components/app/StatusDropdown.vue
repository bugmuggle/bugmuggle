<template>
  <UDropdownMenu :items="items">
    <span
      :class="[
        'px-3 py-1 rounded text-sm cursor-pointer block text-center',
        statusColors[modelValue]
      ]"
    >
      {{ modelValue }}
    </span>
  </UDropdownMenu>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: TaskStatus
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: TaskStatus): void
}>()

const statusOptions: TaskStatus[] = [
  'COMPLETED',
  'PROGRESS',
  'PENDING',
  'BLOCKED',
  'CANCELLED'
]

const statusColors: Record<TaskStatus, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  PROGRESS: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  BLOCKED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-red-200 text-red-800'
}

const items = computed(() =>
  statusOptions.map((s) => ({
    label: s,
    click: () => emit('update:modelValue', s)
  }))
)
</script>
