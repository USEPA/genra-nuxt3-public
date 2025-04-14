<template>
  <client-only>
    <Dialog
      id="ne-explorer-dialog"
      v-model:visible="showDialog"
      modal
      :style="{ width: '90%', height: '90%' }"
      position="center"
      data-testid="neExplorerDialog"
      close-on-escape
      content-class="!h-full !w-full border-t border-gray-300"
      pt:root="relative resize overflow-auto min-w-[300px] min-h-[200px]"
      :pt="{
        header: {
          class: 'pb-2 pt-2',
        },
        content: {
          class: 'overflow-y-hidden pr-0',
        },
      }"
      @show="onDialogShow"
    >
      <template #header>
        <div class="p-dialog-title">
          {{ NE_EXPLORER_DIALOG_HEADER_TEXT }} <Button
            v-tooltip="`Click here to view instructional information on the application of this tool`"
            variant="text"
            label="Click Here"
            icon="pi pi-info-circle"
            severity="secondary"
            size="small"
            @click="openNeHelp"
          />
        </div>
      </template>
      <BlockUI
        ref="dialogRef"
        :blocked="isGraphDisabled"
        class="h-full"
      >
        <div
          class="grid grid-cols-12"
        >
          <div class="col-span-9">
            <NeighborhoodExplorerGraph
              v-if="showGraph"
              ref="neExplorerParentRef"
              :graph-response="props.graphResponse"
              :setup-response="setupResponse"
              :params="params"
              @on-node-select="onNodeSelect"
              @update-graph-disabled-handler="updateGraphDisabledHandler"
              @expand-selected-node="expandSelectedNode"
            />
          </div>
          <div
            class="col-span-3 border-l border-gray-300 overflow-y-auto overflow-x-hidden"
            :style="{
              height: controlPanelHeight,
            }"
          >
            <NeighborhoodExplorerControlPanel
              :selected-node="selectedNode"
              :setup-response="props.setupResponse"
              @start-genra-from-ne="(val: StartGenraFromNeParams) => emits('startGenraFromNe', val)"
            />
          </div>
        </div>
      </BlockUI>
    </Dialog>
  </client-only>
</template>

<script setup lang="ts">
import {NE_EXPLORER_DIALOG_HEADER_TEXT} from '../constants';
import NeighborhoodExplorerGraph from './Graph/NeighborhoodExplorerGraph.vue';
import NeighborhoodExplorerControlPanel from './ControlPanel/NeighborhoodExplorerControlPanel.vue';
import type {
  ForceGraphNode,
} from './types';
import type {NeighborhoodGraphResponse, SetupResponse} from '~/api/types';
import type {StartGenraFromNeParams} from '~/stores/radial/types';

const props = defineProps<{
  show: boolean;
  params: Params;
  neExplorerHelpText: string;
  setupResponse: SetupResponse | Record<string, never>;
  graphResponse: NeighborhoodGraphResponse | undefined;
}>();

const emits = defineEmits<{
  closeDialog: [];
  startGenraFromNe: [params: StartGenraFromNeParams];
}>();

const showDialog = computed({
  get() {
    return props.show;
  },
  set(val) {
    emits('closeDialog');
    if (!val) {
      resetOnClose();
    }
  },
});

const resetOnClose = () => {
  showGraph.value = false;
  selectedNode.value = null;
};

const onDialogShow = () => {
  setTimeout(() => {
    showGraph.value = true;
  }, 500);
};

const dialogRef = ref();

const isGraphDisabled = ref(false);
const updateGraphDisabledHandler = (isDisabled: boolean) => {
  isGraphDisabled.value = isDisabled;
};

// Header
const openNeHelp = () => {
  const child = window.open('about:blank', '_blank');
  child?.document?.write(`${props.neExplorerHelpText}`);
  child?.document?.close();
};

// Control Panel
const controlPanelHeight = ref('900px');
onMounted(() => {
  /* istanbul ignore next -- @preserve */
  useResizeObserver(dialogRef, (entries) => {
    try {
      const entry = entries[0];
      const {
        height,
      } = entry!.contentRect;

      if (height) {
        controlPanelHeight.value = `${height}px`;
      }
    } catch {
    // ignore error
    }
  });
});

/** Graph */
const neExplorerParentRef = shallowRef();
const showGraph = ref(false);

/** Variables synched with graph **/

// Selected Node
const selectedNode = ref<ForceGraphNode | null>(null);
const onNodeSelect = (node: ForceGraphNode | null) => {
  selectedNode.value = node;
};
const expandSelectedNode = (isExpanded: boolean) => {
  if (selectedNode.value) {
    selectedNode.value.expanded = isExpanded;
  }
};
</script>
