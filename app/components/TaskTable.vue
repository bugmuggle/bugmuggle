<template>
  <div class="p-4 border rounded-md border-neutral-700 h-full">
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      :theme="theme"
      style="height: 100%"
    >
    </ag-grid-vue>
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
  },
  light: {
    backgroundColor: 'transparent',
    foregroundColor: 'black',
    headerTextColor: 'black',
    headerBackgroundColor: '#EAEAEA',
    oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)',
    headerColumnResizeHandleColor: 'black',
    wrapperBorder: false,
  }
}

const theme = computed(() => isDark.value ? themeBalham.withParams(themeParams.dark) : themeBalham.withParams(themeParams.light))

const rowData = ref([
  { make: "Tesla", model: "Model Y", price: 64950, electric: true },
  { make: "Ford", model: "F-Series", price: 33850, electric: false },
  { make: "Toyota", model: "Corolla", price: 29600, electric: false },
]);

const colDefs = ref([
  { field: "make", flex: 2 },
  { field: "model", flex: 1 },
  { field: "price", flex: 1 },
  { field: "electric", flex: 1 }
]);
</script>