<template>
  <div class="grid h-full min-h-[750px]">
    <BlockUI :blocked="shouldBlockReadAcrossPanel">
      <div class="col-span-12 bg-[#e8f6fd] border-solid border-b border-[#ddd] h-[13%]">
        <ReadAcrossMenuBar
          :read-across-response="readAcrossResponse"
          :download-options="readAcrossDownloadOptions"
          :run-read-across-form="runReadAcrossForm"
          :params="params"
          :current-step="currentStep"
          :show-selection-change-dialog="showSelectionChangeDialog"
          @update-read-across-form="updateReadAcrossForm"
          @run-read-across="runReadAcrossHandler"
          @read-across-download="readAcrossDownloadHandler"
        />
      </div>
      <div class="col-span-12 h-[87%]">
        <ReadAcrossGrid
          :read-across-response="gridDataResponse"
          :paginate="runReadAcrossForm.paginate"
          :sort-by="runReadAcrossForm.sortBy"
          :sort-order="runReadAcrossForm.sortOrder"
          :sim-weight="runReadAcrossForm.simWeight"
          @update-filter="updateCurrentFilterHandler"
        />
      </div>
      <ReadAcrossSelectionDialog
        :show="showSelectionChangeDialog"
        @close-dialog="showSelectionChangeDialog = false"
        @reset="resetReadAcrossHandler"
      />
    </BlockUI>
  </div>
</template>

<script setup lang="ts">
import ReadAcrossMenuBar from './ReadAcrossMenuBar/ReadAcrossMenuBar.vue';
import ReadAcrossGrid from './ReadAcrossGrid/ReadAcrossGrid.vue';
import ReadAcrossSelectionDialog from './ReadAcrossSelectionDialog.vue';
import type {
  RunReadAcrossForm, UpdateRunReadAcrossFormParams,
} from './ReadAcrossMenuBar/types';
import {useReadAcrossStore} from '~/stores/readAcross/readAcross';
import {useRadialStore} from '~/stores/radial/radial';
import {useFingerprintStore} from '~/stores/fingerprint/fingerprint';
import {useAssayStore} from '~/stores/assay/assay';

const readAcrossStore = useReadAcrossStore();
const {
  runReadAcross, setSimilarityWidthHandler, readAcrossDownload,
} = readAcrossStore;
const {
  readAcrossResponse, isReadAcrossLoading, runReadAcrossResponse, showSelectionChangeDialog,
} = storeToRefs(readAcrossStore);

const baseStore = useAppBaseStore();
const {
  params, setupResponse, currentStep,
} = storeToRefs(baseStore);

const readAcrossDownloadOptions = computed(() => setupResponse.value.download.filter(({rel, subdir}) => !!subdir &&
  (!rel || rel.includes('readacross'))));

const {isRadialPanelLoading} = storeToRefs(useRadialStore());
const {isFingerprintLoading} = storeToRefs(useFingerprintStore());
const {isAssayLoading} = storeToRefs(useAssayStore());
const shouldBlockReadAcrossPanel = computed(() => isRadialPanelLoading.value ||
  isFingerprintLoading.value ||
  isAssayLoading.value ||
  isReadAcrossLoading.value);

// Grid
const gridDataResponse = computed(() => currentStep.value === 4 ?
  runReadAcrossResponse.value :
  readAcrossResponse.value);

const currentFilter = ref('');
const updateCurrentFilterHandler = (filter: string) => {
  currentFilter.value = filter;
};

// Selection Change Dialog
const resetReadAcrossHandler = () => {
  showSelectionChangeDialog.value = false;
  currentStep.value = 3;
};

// Run Read Across Form
const runReadAcrossForm = ref<RunReadAcrossForm>({
  engine: params.value.engine,
  sortBy: readAcrossResponse.value?.sortOptions?.[0]?.key,
  sortOrder: 'asc',
  minMinus: params.value.neg0,
  minPlus: params.value.pos0,
  simWeight: false,
  paginate: true,
});

watch(() => params.value.engine, (newVal) => {
  if (newVal !== runReadAcrossForm.value.engine) {
    runReadAcrossForm.value.engine = newVal;
  }
}, {deep: true});

watch(() => runReadAcrossForm.value.simWeight, (newVal) => {
  setSimilarityWidthHandler(newVal);
}, {deep: true});

onUnmounted(() => {
  setSimilarityWidthHandler(false);
});

const updateReadAcrossForm = (updateVal: UpdateRunReadAcrossFormParams) => {
  const {
    key, value, fromCancelSelectionDialog,
  } = updateVal;

  const isKeyDialogTrigger = key === 'minMinus' || key === 'minPlus' || key === 'engine';
  if (currentStep.value > 3 && isKeyDialogTrigger && !fromCancelSelectionDialog) {
    showSelectionChangeDialog.value = true;
  }
  runReadAcrossForm.value = {
    ...runReadAcrossForm.value,
    [key]: value,
  };
};

const runReadAcrossHandler = () => {
  runReadAcross(runReadAcrossForm.value);
};

const readAcrossDownloadHandler = (subdir: string) => {
  readAcrossDownload(subdir, currentFilter.value);
};
</script>
