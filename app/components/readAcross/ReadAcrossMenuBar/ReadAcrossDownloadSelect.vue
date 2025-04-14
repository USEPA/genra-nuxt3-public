<template>
  <FloatLabel class="row-start-2">
    <Select
      ref="downloadDropdownRef"
      v-model="download"
      v-tooltip="'Select an option to download'"
      input-id="download-dropdown"
      :aria-label="DOWNLOAD_LABEL_TEXT"
      :options="props.downloadOptions"
      option-label="name"
      option-value="subdir"
      option
      :dropdown-icon="PrimeIcons.DOWNLOAD"
      size="small"
      title="name"
      class="!w-full"
    >
      <template #option="slotProps">
        <span
          v-tooltip="slotProps.option.description"
        >
          {{ slotProps.option.name }}
        </span>
      </template>
    </Select>
    <label
      for="download-dropdown"
      class="!font-bold text-ellipsis w-[60%] overflow-hidden whitespace-nowrap"
    >{{ DOWNLOAD_LABEL_TEXT }}</label>
  </FloatLabel>
</template>

<script setup lang="ts">
import {PrimeIcons} from '@primevue/core';
import type {Select} from 'primevue';
import type {SetupDownloadItem} from '~/api/types';
import {DOWNLOAD_LABEL_TEXT} from '~/components/radial/RadialMenuBar/constants';

const props = defineProps<{
  downloadOptions: SetupDownloadItem[];
  params: Params;
}>();

const emits = defineEmits<{
  readAcrossDownload: [subdir: string];
}>();

const downloadDropdownRef = ref<InstanceType<typeof Select> & {
  updateModel: () => void;
}>();

const download = computed({
  get() {
    return null;
  },
  set(val: string | null) {
    if (val) {
      emits('readAcrossDownload', val);
      download.value = null;
      downloadDropdownRef.value?.updateModel();
    }
  },
});
</script>
