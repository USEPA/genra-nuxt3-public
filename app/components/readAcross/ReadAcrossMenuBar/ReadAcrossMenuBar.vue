<template>
  <div class="grid grid-cols-12 gap-1 ml-1 h-full">
    <div
      class="col-span-2 h-full content-center"
    >
      <RunReadAcrossBtn @run-read-across="runReadAcross" />
    </div>
    <div
      class="col-span-2 h-full mt-2 content-center"
    >
      <ReadAcrossPredEngineSelect
        :engine="props.params.engine"
        :pred-engines="predictionEngines"
        :show-selection-change-dialog="showSelectionChangeDialog"
        :current-step="props.currentStep"
        @update-read-across-form="updateReadAcrossForm"
      />
    </div>
    <div
      class="col-span-2 h-full mt-2 content-center whitespace-nowrap"
    >
      <ReadAcrossSortBySelect
        :sort-options="props.readAcrossResponse?.sortOptions"
        :sort-by="props.runReadAcrossForm.sortBy"
        :sort-order="props.runReadAcrossForm.sortOrder"
        @update-read-across-form="updateReadAcrossForm"
      />
    </div>
    <div
      class="col-span-2 h-full mt-2 content-center"
    >
      <ReadAcrossObservationsSelect
        :min-neg="props.runReadAcrossForm.minMinus"
        :min-pos="props.runReadAcrossForm.minPlus"
        :show-selection-change-dialog="showSelectionChangeDialog"
        :current-step="props.currentStep"
        @update-read-across-form="updateReadAcrossForm"
      />
    </div>
    <div
      class="col-span-1 h-full whitespace-nowrap overflow-hidden content-center"
    >
      <ReadAcrossSimilaritySwitch
        :sim-weight="props.runReadAcrossForm.simWeight"
        @update-read-across-form="updateReadAcrossForm"
      />
    </div>
    <div
      class="col-span-1 h-full content-center"
    >
      <ReadAcrossPaginationSwitch
        :paginate="props.runReadAcrossForm.paginate"
        @update-read-across-form="updateReadAcrossForm"
      />
    </div>
    <div class="col-span-2 h-full">
      <div class="grid grid-cols-3 h-full">
        <div class="col-span-2 h-full mt-2 content-center">
          <ReadAcrossDownloadSelect
            :download-options="props.downloadOptions"
            :params="props.params"
            @read-across-download="(val:string) => emits('readAcrossDownload', val)"
          />
        </div>
        <div class="col-span-1 self-center !w-[50%] justify-self-end">
          <Help
            :help-key="HelpTextKey.READACROSS"
            class="mb-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RunReadAcrossBtn from './RunReadAcrossBtn.vue';
import ReadAcrossPredEngineSelect from './ReadAcrossPredEngineSelect.vue';
import ReadAcrossSortBySelect from './ReadAcrossSortBySelect.vue';
import ReadAcrossObservationsSelect from './ReadAcrossObservationsSelect.vue';
import ReadAcrossSimilaritySwitch from './ReadAcrossSimilaritySwitch.vue';
import ReadAcrossPaginationSwitch from './ReadAcrossPaginationSwitch.vue';
import ReadAcrossDownloadSelect from './ReadAcrossDownloadSelect.vue';
import type {
  RunReadAcrossForm, UpdateRunReadAcrossFormParams,
} from './types';
import Help from '~/components/ui/Help/Help.vue';
import type {ReadAcrossResponse, SetupDownloadItem} from '~/api/types';
import {HelpTextKey} from '~/components/ui/Help/constants';

const props = defineProps<{
  readAcrossResponse: ReadAcrossResponse | undefined;
  downloadOptions: SetupDownloadItem[];
  params: Params;
  showSelectionChangeDialog: boolean;
  currentStep: number;
  runReadAcrossForm: RunReadAcrossForm;
}>();

const emits = defineEmits<{
  updateReadAcrossForm: [val: UpdateRunReadAcrossFormParams];
  runReadAcross: [];
  readAcrossDownload: [subdir: string];
}>();

const updateReadAcrossForm = (updateVal: UpdateRunReadAcrossFormParams) => {
  emits('updateReadAcrossForm', updateVal);
};

// Prediction Engines
const predictionEngines = computed(() => props.readAcrossResponse?.predEngines
  .filter(({data_exists: dataExists}) => !!dataExists));

// Run Read Across action
const runReadAcross = () => {
  emits('runReadAcross');
};
</script>
