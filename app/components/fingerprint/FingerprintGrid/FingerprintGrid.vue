<template>
  <div
    id="heatgrid"
    class="m-2 mt-1"
    :style="{ height: gridHeight }"
    cy-data="agHeatGrid"
  >
    <ag-grid-vue
      class="ag-theme-balham"
      :style="`height: 93%; width: 100%`"
      :row-data="rowData"
      :column-defs="columnDefs"
      :grid-options="fpGridOptions"
    />
  </div>
</template>

<script setup lang="ts">
import {AgGridVue} from 'ag-grid-vue3';
import {fpGridOptions} from './config/fingerprintGridOptions';
import {getHeatVal} from './config/gridUtil';
import HeatColoredNumber from './renderers/HeatColoredNumber.vue';
import GenraChemicalLink from './renderers/GenraChemicalLink.vue';
import type {FingerprintHeatChartResponse} from '~/api/types';

const props = defineProps<{
  fingerprintResponse: FingerprintHeatChartResponse | Record<string, never>;
}>();

const rowData = computed(() => props.fingerprintResponse.data);

const columnDefs = computed(() => props.fingerprintResponse.columns.map(col => ({
  ...col,
  ...(col.field !== 'name' && {valueGetter: getHeatVal}),
})));

const gridHeight = computed(() => {
  const numOfChemicals = props.fingerprintResponse.data.length;
  if (numOfChemicals <= 11) {
    return '100%';
  }

  return `${(500 + ((numOfChemicals - 11) * 28)).toString()}px`;
});

defineExpose({
  HeatColoredNumber,
  GenraChemicalLink,
});
</script>

<style>
#heatgrid {
  .ag-cell-label-container {
    /*Necessary to allow for text to grow vertically*/
    height: 100% !important;
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
    height: 100%;
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
    margin-top: 10px !important;
    writing-mode: vertical-lr;
    -ms-writing-mode: tb-lr;
    text-overflow: ellipsis !important;
  }
  ag-header-row {
    max-height: 70px !important;
  }
}
.ag-status-bar span {
  color: #707070
}
.ag-paging-panel {
  color: #707070
}
</style>
