<template>
  <div class="grid grid-cols-12 gap-1 ml-1 h-full items-end pb-1">
    <div class="col-span-2">
      <AnalogueInputField
        :num-of-analogues="numOfAnalogues"
        @num-of-analogues-change-hander="(val) => emits('numOfAnaloguesChangeHandler', val)"
      />
    </div>
    <div class="col-span-3">
      <Button
        v-tooltip="!!props.physchemPlotUrl ? 'Click to view Physchem plot ' : 'Physchem Plot unavailable'"
        size="small"
        :disabled="!props.physchemPlotUrl"
        @click="openDialogHandler"
      >
        {{ PHYSCHEM_PLOT_BTN_TEXT }}
      </Button>
      <PhyschemDialog
        :show="showPhyschemDialog"
        :physchem-plot-url="props.physchemPlotUrl"
        @close-dialog="showPhyschemDialog = false"
      />
    </div>
    <div class="col-span-5">
      <Button
        v-tooltip="isNeExplorerDisabled
          ? 'Neighborhood Exploration unavailable with current combinations of fingerprints/filters'
          : 'Click to access Neighborhood Exploration tool'"
        size="small"
        :disabled="isNeExplorerDisabled"
        @click="showNeExplorerDialog = true"
      >
        {{ NE_EXPLORER_BTN_TEXT }}
      </Button>
      <NeighborhoodExplorerDialog
        :show="showNeExplorerDialog"
        :params="params"
        :ne-explorer-help-text="neExplorerHelpText"
        :graph-response="props.graphResponse"
        :setup-response="props.setupResponse"
        @close-dialog="showNeExplorerDialog = false"
        @start-genra-from-ne="startNeFromCustomNn"
      />
    </div>
    <div
      v-if="props.currentStep <= 1"
      class="col-span-2"
    >
      <Button
        size="small"
        :aria-label="props.isRadialLoading ? 'Loading' : 'Next'"
        :icon="props.isRadialLoading ? 'pi pi-spin pi-spinner' : ''"
        :label="props.isRadialLoading ? '' : `${NEXT_BTN_TEXT}`"
        :disabled="props.isNextDisabled"
        icon-pos="right"
        @click="next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NeighborhoodExplorerDialog from '../NeighborhoodExplorer/NeighborhoodExplorerDialog.vue';
import {graphDataIsEmpty} from '../NeighborhoodExplorer/Graph/helpers';
import AnalogueInputField from './AnalogueInputField.vue';
import PhyschemDialog from './PhyschemDialog.vue';
import {
  NEXT_BTN_TEXT, PHYSCHEM_PLOT_BTN_TEXT,
  NE_EXPLORER_BTN_TEXT,
} from './constants';
import type {StartGenraFromNeParams} from '~/stores/radial/types';
import type {NeighborhoodGraphResponse, SetupResponse} from '~/api/types';

const props = defineProps<{
  params: Params;
  physchemPlotUrl: string;
  setupResponse: SetupResponse | Record<string, never>;
  isRadialLoading: boolean;
  currentStep: number;
  isNextDisabled: boolean;
  neExplorerHelpText: string;
  graphResponse: NeighborhoodGraphResponse | undefined;
}>();

const emits = defineEmits<{
  numOfAnaloguesChangeHandler: [numOfAnalogues: number];
  startGenraFromNe: [params: StartGenraFromNeParams];
  next: [];
}>();

// Physchem Plot
const showPhyschemDialog = ref(false);

const openDialogHandler = () => {
  if (props.physchemPlotUrl) {
    showPhyschemDialog.value = true;
  }
};

// Analogue Input
const numOfAnalogues = computed(() => props.params.k0);

// NE Explorer
const showNeExplorerDialog = ref(false);

const isNeExplorerDisabled = computed(() => {
  if (!props.graphResponse) {
    return true;
  }
  return graphDataIsEmpty(props.graphResponse);
});

const startNeFromCustomNn = (val: StartGenraFromNeParams) => {
  showNeExplorerDialog.value = false;
  emits('startGenraFromNe', val);
};

// Next Button
const next = () => {
  if (!props.isNextDisabled) {
    emits('next');
  }
};
</script>
