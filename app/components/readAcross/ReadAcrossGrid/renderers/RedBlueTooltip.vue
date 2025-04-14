<template>
  <div style="height: 100%">
    <div
      class="cell h-full w-full"
      data-testid="redBlueToolTipContainer"
      :style="{ opacity }"
    >
      <div
        v-if="params.value.useWidth"
        data-testid="redBlueToolTipWithWidth"
        class="h-full"
        :style="{ backgroundColor: color, width: width }"
      />
      <div
        v-else
        class="h-full"
        data-testid="redBlueToolTipWithoutWidth"
        :style="{ backgroundColor: color, width: width }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {RedBlueTooltipParams} from '../types';
import {
  REDBLUE_DEFAULT_COLOR, REDBLUE_NO_EFFECT_COLOR, REDBLUE_PREDICTION_WITH_VALUE_COLOR,
  REDBLUE_WITH_NO_DATA_COLOR, REDBLUE_NO_DATA, REDBLUE_NO_EFFECT,
} from './constants';
import type {ReadAcrossCellItem, ReadAcrossItem} from '~/api/types';

const props = defineProps<{
  params: ICellRendererParams<ReadAcrossItem> & RedBlueTooltipParams;
}>();

const cellData = computed(() => props.params.value as ReadAcrossCellItem);

const opacity = computed(() => {
  const colId = props.params.colDef?.field as keyof ReadAcrossItem;
  const currentChemObj = props.params?.data?.[colId] as ReadAcrossCellItem;
  if (cellData.value && cellData.value.isPrediction &&
    (currentChemObj?.isChecked || props.params?.colDef?.headerComponentParams.targetChem)) {
    if (cellData.value.pval) {
      const opac = cellData.value?.pval * 0.6 + 0.1;
      return opac;
    }
  }
  return (currentChemObj?.isChecked ||
    props.params.colDef?.headerComponentParams.targetChem) ?
    1 :
    0.4;
});

const color = computed(() => {
  if ((!Number.isNaN(cellData.value.value) && cellData.value.value !== REDBLUE_NO_DATA &&
    cellData.value.value !== REDBLUE_NO_EFFECT) && cellData.value.isPrediction) {
    return REDBLUE_PREDICTION_WITH_VALUE_COLOR;
  } else if (cellData.value.value === REDBLUE_NO_DATA) {
    return REDBLUE_WITH_NO_DATA_COLOR;
  } else if (cellData.value.value === REDBLUE_NO_EFFECT) {
    return REDBLUE_NO_EFFECT_COLOR;
  }
  return REDBLUE_DEFAULT_COLOR;
});

const width = computed(() => {
  if (props.params?.value.useWidth) {
    const simWidth = `${cellData.value.similarity * 100}%`;
    return simWidth;
  }
  return '100%';
});
</script>
