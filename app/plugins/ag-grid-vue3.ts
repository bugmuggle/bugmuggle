import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";

export default defineNuxtPlugin((nuxtApp) => {
  ModuleRegistry.registerModules([AllCommunityModule]);

  nuxtApp.vueApp.component('ag-grid-vue', AgGridVue);
})
