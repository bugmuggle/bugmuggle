<template>
  <UDropdownMenu :items="items">
    <div class="flex items-center gap-2 cursor-pointer">
      <img
        v-if="selectedUser"
        :src="selectedUser.avatar"
        class="w-6 h-6 rounded-full"
      >
      <span>{{ selectedUser?.name ?? 'Unknown' }}</span>
    </div>
  </UDropdownMenu>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const users: UserOption[] = [
  { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/83.jpg' },
  { id: 2, name: 'Sarah Lee', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' },
  { id: 3, name: 'Mike Brown', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
  { id: 4, name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/80.jpg' },
  { id: 5, name: 'David Wilson', avatar: 'https://randomuser.me/api/portraits/men/30.jpg' },
  { id: 6, name: 'Sophia Taylor', avatar: 'https://randomuser.me/api/portraits/women/30.jpg' }
];

const selectedUser = computed(() =>
  users.find((u) => u.id === props.modelValue)
)

const items = computed(() =>
  users.map((u) => ({
    label: u.name,
    icon: () => h('img', { src: u.avatar, class: 'w-4 h-4 rounded-full' }),
    click: () => emit('update:modelValue', u.id)
  }))
)
</script>
