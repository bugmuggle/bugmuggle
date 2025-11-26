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
  'CANCELLED',
  'STARTING'
]
const statusColors: Record<TaskStatus, string> = {
  COMPLETED: 'bg-green-900 text-green-200',
  PROGRESS: 'bg-blue-900 text-blue-200',
  PENDING: 'bg-yellow-900 text-yellow-200',
  BLOCKED: 'bg-red-900 text-red-200',
  CANCELLED: 'bg-red-900 text-red-200',
  STARTING: 'bg-purple-900 text-purple-200'
}


const items = computed(() =>
  statusOptions.map((s) => ({
    label: s,
    click: () => emit('update:modelValue', s)
  }))
)
</script>
