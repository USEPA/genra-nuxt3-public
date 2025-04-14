<template>
  <div>
    <span>{{ props.params.value.value }}</span>
  </div>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {RedBlueTooltipParams} from '../types';
import type {ReadAcrossItem} from '~/api/types';

const props = defineProps<{
  params: ICellRendererParams<ReadAcrossItem> & RedBlueTooltipParams;
}>();
</script>
