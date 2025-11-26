<template>
  <div class="relative h-[100dvh] w-full overlfow-hidden">
    <div
      :class="[
        'z-10 absolute bg-neutral-800/30 top-0 bottom-0 left-0 overlfow-y-auto',
        isChatOpen ? 'right-128' : 'right-0'
      ]"
    >
      <div class="flex items-center gap-3 h-12 px-3">
        <p class="text-lg font-bold">
          <slot name="title" />
        </p>
        <div class="grow" />
        <UButton
          v-if="!isChatOpen"
          color="neutral"
          icon="lucide:panel-right-open"
          size="md"
          variant="ghost"
          @click="toggleChatWindow"
        />
      </div>
    <div class="h-full overflow-auto">
      <slot />
    </div>
    </div>
    <div
      :class="[
        'z-5 absolute top-0 right-0 bottom-0 w-128 overflow-y-auto',
        isChatOpen ? 'visible': 'invisible'
      ]"
    >
      <div class="flex items-center gap-3 h-12 px-3">
        <p class="font-bold text-lg">Chat</p>
        <div class="grow" />
        <UButton color="neutral" icon="lucide:panel-right-close" size="md" variant="ghost" @click="toggleChatWindow" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const isChatOpen = computed(() => +(route.query.chat ?? 0))

const toggleChatWindow = function () {
  router.push({ query: { chat: isChatOpen.value ? 0 : 1 }})
}
</script>
