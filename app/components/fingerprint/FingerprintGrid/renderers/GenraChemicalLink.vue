<template>
  <div class="text-base">
    <a
      v-if="props.params.data?.details_link"
      target="_blank"
      :href="`${props.params.data.details_link}`"
      tabindex="0"
    >
      {{ display }}
    </a>
    <span
      v-else
    >
      {{ display }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {FingerprintData} from '~/api/types';

const props = defineProps<{
  params: ICellRendererParams<FingerprintData> & {
    useField: keyof FingerprintData;
  };
}>();

const display = computed(() => props.params.useField ? props.params.data?.[props.params.useField] : props.params.value);
</script>
