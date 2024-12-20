<template>
  <div class="space-y-0 flex flex-col px-3 h-full pb-4 cursor-text" @click="onClickCompose">
    <div class="flex items-center gap-3 h-12 py-3 sticky top-0 bg-gray-900">
      <UButton
        icon="i-heroicons-bold"
        class="compose-action"
        variant="ghost"
        color="gray"
        @click="editor.commands.toggleBold()"
      />
      <UButton
        icon="i-heroicons-italic"
        variant="ghost"
        class="compose-action"
        color="gray"
        @click="editor.commands.toggleItalic()"
      />
      <UButton
        icon="i-heroicons-strikethrough"
        variant="ghost"
        class="compose-action"
        color="gray"
        @click="editor.commands.toggleStrike()"
      />

      <div class="w-1 h-full border-r border-gray-700" />

      <UButton
        icon="i-heroicons-list-bullet"
        variant="ghost"
        class="compose-action"
        color="gray"
        @click="editor.commands.toggleBulletList()"
      />

      <UButton
        icon="i-heroicons-numbered-list"
        variant="ghost"
        class="compose-action"
        color="gray"
        @click="editor.commands.toggleOrderedList()"
      />

      <div class="w-1 h-full border-r border-gray-700" />

      <UButton
        icon="i-heroicons-link"
        variant="ghost"
        class="compose-action"
        color="gray"
        @click="editor.commands.toggleLink()"
      />

    </div>
    <div class="px-3 cursor-text" @click="editor.commands.focus()">
      <TipTapEditorContent :editor="editor" />
    </div>
    <div class="flex items-center gap-3 sticky bottom-0 bg-gray-900">
      <div class="grow" />
      <UButton
        icon="i-heroicons-paper-airplane"
        variant="ghost"
        class="compose-action"
        color="gray"
        @click="sendMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/store/chat'
import StarterKit from '@tiptap/starter-kit'
import { Extension } from '@tiptap/core'
const { $TipTapEditor } = useNuxtApp()

const emits = defineEmits(['sent'])

const projectId = useRoute().params.projectId
const editor = ref(null)
const chatStore = useChatStore()

const DisableEnter = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        sendMessage()
        return true
      },
      'Mod-Enter': ({ editor }) => {
        editor.commands.insertContent('<br>')
        return true
      },
    };
  },
});

const sendMessage = () => {
  const message = editor.value.getHTML()
  chatStore.sendMessage(message, projectId)
    .finally(() => {
      editor.value.commands.clearContent()
      emits('sent')
    })
}

onMounted(() => {
  editor.value = new $TipTapEditor({
    content: '',
    extensions: [
      StarterKit,
      DisableEnter
    ]
  })
})

const onClickCompose = (e) => {
  // Don't focus if clicking on a compose action button
  // if (e.target.closest('.compose-action')) return
  
  editor.value.commands.focus()
}

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<style>
.ProseMirror {
  outline: none !important;
}
</style>
