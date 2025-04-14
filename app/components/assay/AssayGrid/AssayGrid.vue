<template>
  <div
    id="assaygrid"
    class="m-2 mt-1 h-full assay-grid"
    cy-data="agHeatGrid"
  >
    <ag-grid-vue
      ref="gridRef"
      class="ag-theme-balham w-full h-full"
      :row-data="rowData"
      :column-defs="columnDefs"
      :grid-options="assayGridOptions"
      :pagination="props.paginate"
    />
  </div>
</template>

<script setup lang="ts">
import {AgGridVue} from 'ag-grid-vue3';
import {assayGridOptions} from './config/assayGridOptions';
import type {AssayResponse} from '~/api/types';

const props = defineProps<{
  assayResponse: AssayResponse | undefined;
  paginate: boolean;
}>();

const gridRef = ref<InstanceType<typeof AgGridVue>>();

/* istanbul ignore next -- @preserve */
watch(() => props.assayResponse?.columns, (newVal, oldVal) => {
  if (newVal && oldVal && gridRef.value?.api && newVal.length !== oldVal.length) {
    setTimeout(() => {
      resizeGrid(gridRef.value?.api);
    }, 200);
  }
}, {deep: true});

const rowData = computed(() => props.assayResponse?.data || []);
const columnDefs = computed(() => props.assayResponse?.columns || []);
</script>

<style>
#assaygrid {
  height: 100%;
  width:100%;
  margin-top: 5px;
  padding-right: 10px;
  padding-bottom: 10px;
  .ag-cell-label-container {
    /*Necessary to allow for text to grow vertically*/
    height: 105px !important;
  }
  .ag-header-cell-text {
    color: #6E6E6E;
  }
  .ag-header-cell {
    padding-left: 2px !important;
    padding-right: 2px !important;

  }
  .ag-header-cell-label {
    /*Necessary to allow for text to grow vertically*/
    height: 85px;
    margin-top: 5px;
    padding: 0 !important;
  }
  .ag-cell .ag-cell-not-inline-editing .ag-cell-auto-height .ag-cell-focus {
    border: 1px solid transparent;
    line-height: 26px;
    padding-left: 4px !important;
    padding-right: 4px !important;
  }
  .ag-cell, .ag-theme-balham .ag-full-width-row .ag-cell-wrapper.ag-row-group {
   padding-left: 4px !important;
   padding-right: 4px !important;
  }
  .ag-header-cell-label .ag-header-cell-text {
    /*Force the width corresponding at how much width
      we need once the text is laid out vertically*/
    width: auto;
    margin-top: 0px !important;
    writing-mode: vertical-lr;
    height: 100%;
    overflow: hidden;
    -ms-writing-mode: tb-lr;
    text-overflow: ellipsis !important;
  }
  ag-header-row {
    max-height: 70px !important;
  }
}
</style>
