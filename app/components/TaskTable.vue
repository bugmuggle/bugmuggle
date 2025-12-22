<template>
  <div class="relative">
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      :theme="theme"
      :domLayout="'autoHeight'"
      style="height: auto"
    />

    <div class="flex items-center gap-3 mt-4">
      <UButton
        variant="outline"
        size="sm"
        icon="lucide-plus"
        color="neutral"
      >
        Add Task
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { themeBalham } from 'ag-grid-community';
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

const themeParams = {
  dark: {
    backgroundColor: 'transparent',
    foregroundColor: 'white',
    headerTextColor: 'white',
    headerBackgroundColor: '#262626',
    oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)',
    headerColumnResizeHandleColor: 'white',
    wrapperBorder: false,
    statusBar: null
  },
  light: {
    backgroundColor: 'transparent',
    foregroundColor: 'black',
    headerTextColor: 'black',
    headerBackgroundColor: '#EAEAEA',
    oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)',
    headerColumnResizeHandleColor: 'black',
    wrapperBorder: false,
    statusBar: null
  }
}

const theme = computed(() => isDark.value ? themeBalham.withParams(themeParams.dark) : themeBalham.withParams(themeParams.light))

const rowData = ref([
  { make: "Tesla", model: "Model Y", price: 64950, electric: true },
]);

const colDefs = ref([
  { field: "make", flex: 2 },
  { field: "model", flex: 1 },
  { field: "price", flex: 1 },
  { field: "electric", flex: 1 }
]);
</script>