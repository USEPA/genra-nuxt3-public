<template>
  <div class="grid grid-cols-12 gap-2 ml-1 h-full">
    <div
      ref="neighborByContainerRef"
      class="col-span-5 h-full mt-6 mb-1"
    >
      <FloatLabel class="row-start-2">
        <Select
          id="neighborById"
          ref="selectedFpRef"
          v-model="selectedFp"
          aria-labelledby="neighbor-by-label"
          :aria-label="NEIGHBORS_BY_LABEL_TEXT"
          input-id="neighbor-by"
          :options="props.neighborByOptions"
          option-label="name"
          option-value="key"
          size="small"
          class="!w-full"
        >
          <template #option="slotProps">
            <div
              v-tooltip="slotProps.option.description"
              class="flex align-items-center"
            >
              {{ slotProps.option.key === 'hybrid' && isHybridFp ? 'Edit ' : '' }}{{ slotProps.option.name }}
            </div>
          </template>
        </Select>
        <label
          id="neighbor-by-label"
          for="neighbor-by"
          class="!font-bold !text-[#6E6E77]"
        >{{ NEIGHBORS_BY_LABEL_TEXT }}</label>
      </FloatLabel>
      <HybridFpPopover
        ref="hybridPopoverRef"
        :neighbor-by-options="props.neighborByOptions"
        :is-hybrid-fp="isHybridFp"
        :fp="props.params.fp"
        :weight="props.params.fp_weight"
        @on-hybrid-popover-close="onHybridPopoverClose"
        @hybrid-fp-change="(ev) => emits('hybridFpChangeHandler', ev)"
      />
    </div>
    <div class="col-span-3 h-full mt-6">
      <FloatLabel class="row-start-2">
        <Select
          v-model="selectedFilterBy"
          input-id="filter-by"
          :options="props.filterByOptions"
          option-label="name"
          :aria-label="FILTER_BY_LABEL_TEXT"
          option-value="key"
          size="small"
          class="!w-full"
        >
          <template #option="slotProps">
            <div
              v-tooltip="slotProps.option.description"
              class="flex align-items-center"
            >
              {{ slotProps.option.name }}
            </div>
          </template>
        </Select>
        <label
          for="filter-by"
          class="!font-bold !text-[#6E6E77]"
        >{{ FILTER_BY_LABEL_TEXT }}</label>
      </FloatLabel>
    </div>
    <div class="col-span-3 h-full mt-6">
      <FloatLabel class="row-start-2">
        <Select
          ref="downloadDropdownRef"
          v-model="download"
          v-tooltip="'Select an option to download'"
          input-id="download-dropdown"
          :aria-label="DOWNLOAD_LABEL_TEXT"
          :options="downloadOptions"
          option-label="name"
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
    </div>
    <div class="col-span-1 ml-0 self-center">
      <Help :help-key="HelpTextKey.RADIAL" />
    </div>

    <Popover />
  </div>
</template>

<script setup lang="ts">
import fileSaver from 'file-saver';
import {
  Popover, Select,

} from 'primevue';
import {PrimeIcons} from '@primevue/core';
import {useResizeObserver} from '@vueuse/core';
import type {HybridFpOption} from '../types';
import HybridFpPopover from './HybridFpPopover.vue';
import {
  NEIGHBORS_BY_LABEL_TEXT, FILTER_BY_LABEL_TEXT, DOWNLOAD_LABEL_TEXT,
} from './constants';
import type {
  BaseItem, SetupDownloadItem, SetupFilterBy, SetupResponse,
} from '~/api/types';
import Help from '~/components/ui/Help/Help.vue';
import {HelpTextKey} from '~/components/ui/Help/constants';

const props = defineProps<{
  params: Params;
  setupResponse: SetupResponse | Record<string, never>;
  neighborByOptions: BaseItem[];
  filterByOptions: SetupFilterBy[];
}>();

const emits = defineEmits<{
  neighborByChangeHandler: [neighborBy: string];
  filterByChangeHandler: [filterBy: string];
  hybridFpChangeHandler: [hybridOptions: HybridFpOption[]];
}>();

// Hybrid neighbor by
const hybridPopoverRef = ref<InstanceType<typeof HybridFpPopover>>();
const neighborByContainerRef = ref();

onMounted(() => {
  /* istanbul ignore next -- @preserve */
  useResizeObserver(selectedFpRef, () => {
    try {
      if (hybridPopoverRef.value && hybridPopoverRef.value?.showHybridFpOverlayRef?.visible) {
        hybridPopoverRef.value?.showHybridFpOverlayRef?.alignOverlay();
      }
    } catch {
      // ignore error
    }
  });
});
// Neighbor by dropdown
const selectedFpRef = ref();

const isHybridFp = computed(() => !!props.params.fp_weight);

const selectedFp = computed({
  get() {
    return isHybridFp.value ? 'hybrid' : props.params.fp;
  },
  set(val: string) {
    // Show hybrid popover
    if (val === 'hybrid') {
      nextTick(() => {
        const selectElement = document.getElementById('neighborById');
        if (selectElement) {
          hybridPopoverRef.value?.showHybridFpOverlayRef?.show(new Event('Click'), selectElement);
        }
      });
      return;
    }
    hybridPopoverRef.value?.showHybridFpOverlayRef?.hide();
    emits('neighborByChangeHandler', val);
  },
});

const onHybridPopoverClose = () => {
  nextTick(() => {
    selectedFpRef.value!.d_value = selectedFp.value;
  });
};

// Filter by dropdown
const selectedFilterBy = computed({
  get() {
    return props.params.sel_by;
  },
  set(val) {
    emits('filterByChangeHandler', val);
  },
});

// Download
const downloadDropdownRef = ref<InstanceType<typeof Select> & {
  updateModel: () => void;
}>();
const downloadOptions = computed(() => {
  return props.setupResponse.download.filter(({rel}) => rel.includes('radial'));
});

const download = computed({
  get() {
    return null;
  },
  async set(val: SetupDownloadItem | null) {
    if (val?.subdir) {
      const {$repositores} = useNuxtApp();
      const file = await $repositores.genra.genraDownload({
        ...props.params,
        subdir: val.subdir,
      });

      const fileName = getFileNameFromHeaders(file.headers);
      fileSaver.saveAs(file._data as Blob, fileName);
      download.value = null;
      downloadDropdownRef.value?.updateModel();
    }
  },
});
</script>
