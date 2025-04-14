<template>
  <div class="grid h-full">
    <BlockUI :blocked="isRadialPanelLoading">
      <div class="col-span-12 bg-[#e8f6fd] border-solid border-b border-[#ddd] h-[13%]">
        <RadialMenuBar
          :params="params"
          :setup-response="setupResponse"
          :neighbor-by-options="neighborByOptions"
          :filter-by-options="filterByOptions"
          @neighbor-by-change-handler="neighborByChangeHandler"
          @filter-by-change-handler="filterByChangeHandler"
          @hybrid-fp-change-handler="hybridFpChangeHandler"
        />
      </div>
      <div class="col-span-12 h-[75%]">
        <Radial
          :chemicals="radialResponse.result"
          :num-of-analogues="params.k0"
        />
      </div>
      <div class="col-span-12 h-[12%]">
        <RadialFooter
          :params="params"
          :physchem-plot-url="physchemPlotUrl"
          :is-radial-loading="isRadialPanelLoading"
          :current-step="currentStep"
          :setup-response="setupResponse"
          :ne-explorer-help-text="neExplorerDialogHelpText"
          :graph-response="graphResponse"
          :is-next-disabled="isNextDisabled"
          @num-of-analogues-change-handler="numOfAnaloguesChangeHandler"
          @start-genra-from-ne="startGenraFromNe"
          @next="next"
        />
      </div>
    </BlockUI>
  </div>
</template>

<script setup lang="ts">
import RadialMenuBar from './RadialMenuBar/RadialMenuBar.vue';
import Radial from './Radial/Radial.vue';
import RadialFooter from './RadialFooter/RadialFooter.vue';
import {useRadialStore} from '~/stores/radial/radial';

const radialStore = useRadialStore();
const {
  numOfAnaloguesChangeHandler, neighborByChangeHandler, filterByChangeHandler, hybridFpChangeHandler, startGenraFromNe,
} = radialStore;
const {
  isRadialPanelLoading, radialResponse, physchemPlotUrl, neighborByOptions, filterByOptions, graphResponse, isNextDisabled,
} = storeToRefs(radialStore);

const baseStore = useAppBaseStore();
const {setStep} = baseStore;
const {
  params, currentStep, setupResponse,
} = storeToRefs(useAppBaseStore());

const neExplorerDialogHelpText = computed(() => setupResponse.value.help_text
  .find(({helpTextId}) => helpTextId.toLowerCase() === 'GENRA Neighborhood Explorer'.toLowerCase())
  ?.helpText || '');

const next = () => {
  setStep(currentStep.value + 1);
};
</script>
