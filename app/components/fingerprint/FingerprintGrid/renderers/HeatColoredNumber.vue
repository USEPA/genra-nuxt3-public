<template>
  <div
    :class="`w-full text-base h-auto ${textColorClass}`"
    :style="{ backgroundColor: getCellColorFromInfernoMap(scaled) }"
  >
    {{ display }}
  </div>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {getCellColorFromInfernoMap} from '../config/gridUtil';
import type {FingerprintBaseItem, FingerprintData} from '~/api/types';

const props = defineProps<{
  params: ICellRendererParams<FingerprintData>;
}>();

const display = computed(() => props.params.value?.toString() || 'N/A');

const textColorClass = computed(() => scaled.value > 0.4 ? 'text-white' : '');

const scaled = computed(() => {
  const column = props.params.column?.getColId() as keyof FingerprintData;
  const scaledObj = props.params.data?.[column] as FingerprintBaseItem;
  return scaledObj.scaled;
});
</script>
