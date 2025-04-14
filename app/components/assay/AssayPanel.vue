<template>
  <div
    class="grid h-full"
  >
    <BlockUI :blocked="shouldBlockAssayPanel">
      <div class="col-span-12 bg-[#e8f6fd] border-solid border-b border-[#ddd] h-[13%]">
        <AssayMenuBar
          :assay-input-options="assayInputOptions"
          :summarise="params.summarise"
          :paginate="paginate"
          :sumrs-by="params.sumrs_by"
          :current-step="currentStep"
          :is-read-across-loading="isReadAcrossLoading"
          :is-read-across-panel-available="isReadAcrossPanelAvailable"
          @paginate-change-handler="paginateChangeHandler"
          @assay-dropdown-change-handler="assayDropdownChangeHandler"
          @next="nextHandler"
        />
      </div>
      <div class="col-span-12 h-[87%]">
        <AssayGrid
          :assay-response="assayResponse"
          :paginate="paginate"
        />
      </div>
    </BlockUI>
  </div>
</template>

<script setup lang="ts">
import AssayMenuBar from './AssayMenuBar/AssayMenuBar.vue';
import AssayGrid from './AssayGrid/AssayGrid.vue';
import {useAssayStore} from '~/stores/assay/assay';
import {useFingerprintStore} from '~/stores/fingerprint/fingerprint';
import {useRadialStore} from '~/stores/radial/radial';
import {useReadAcrossStore} from '~/stores/readAcross/readAcross';

const assayStore = useAssayStore();
const {isFingerprintLoading} = storeToRefs(useFingerprintStore());
const {isAssayLoading, assayResponse} = storeToRefs(assayStore);
const {assayDropdownChangeHandler} = assayStore;
const {radialResponse, isRadialPanelLoading} = storeToRefs(useRadialStore());
const {isReadAcrossLoading, isReadAcrossPanelAvailable} = storeToRefs(useReadAcrossStore());

const baseStore = useAppBaseStore();
const {setStep} = baseStore;
const {params, currentStep} = storeToRefs(baseStore);

const assayInputOptions = computed(() => radialResponse.value.report_db);

const shouldBlockAssayPanel = computed(() => isFingerprintLoading.value ||
  isAssayLoading.value ||
  isRadialPanelLoading.value);

// Paginate
const paginate = ref(true);
const paginateChangeHandler = (shouldPaginate: boolean) => {
  paginate.value = shouldPaginate;
};

// Next Button
const nextHandler = () => {
  if (isReadAcrossPanelAvailable) {
    const nextStepIdx = steps.findIndex(step => step === 'Step Four: Run GenRA Prediction');
    setStep(nextStepIdx);
  }
};
</script>
