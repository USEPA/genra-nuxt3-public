<template>
  <div class="grid grid-cols-12 border-b border-gray-300 gap-4">
    <Button
      v-tooltip="NE_EXPLORER_RESET_BTN_TEXT"
      size="small"
      variant="text"
      :aria-label="NE_EXPLORER_RESET_BTN_TEXT"
      icon="pi pi-undo"
      class="col-span-2"
      @click="useNeGraphEvent('reset-graph-layout')"
    />
    <h2 class="col-span-8 text-center">
      <strong class="underline decoration-dotted">Chemical Information</strong>
    </h2>
    <Button
      v-tooltip="NE_EXPLORER_DOWNLOAD_BTN_TEXT"
      size="small"
      variant="text"
      :aria-label="NE_EXPLORER_DOWNLOAD_BTN_TEXT"
      icon="pi pi-download"
      class="col-span-2"
      @click="useNeGraphEvent('download')"
    />

    <transition name="fade">
      <h3
        v-if="!props.selectedNode"
        class="col-span-12 ml-1 text-center font-bold"
      >
        {{ NE_EXPLORER_CHEM_INFO_NULL_MSG }}
      </h3>
      <div
        v-else
        class="col-span-12 ml-2"
      >
        <div class="grid grid-cols-12 grid-child">
          <div class="col-span-4">
            <svg
              v-if="imageUrl()"
              width="100"
              height="100"
            > <image
              x="0"
              y="0"
              width="100"
              height="100"
              :href="imageUrl()"
            /></svg>
          </div>
          <div class="col-span-8">
            <h3> <span class="font-bold">Name: </span> {{ props.selectedNode.name }}</h3>
            <h3> <span class="font-bold">Mol. Weight: </span> {{ props.selectedNode.mol_weight }}</h3>
            <h3> <span class="font-bold">DTXCID: </span> {{ props.selectedNode.dsstox_cid }}</h3>
            <h3> <span class="font-bold">DTXSID: </span> {{ props.selectedNode.dsstox_sid }}</h3>
          </div>
        </div>
        <div class="col-span-12 text-center mb-2 mt-2">
          <Button
            v-if="!isExpanded"
            v-tooltip="NE_EXPLORER_EXPAND_BTN_TOOLTIP"
            label="Expand"
            size="small"
            @click="useNeGraphEvent('expand-selected-node',
                                    { selectedNode: props.selectedNode, updatedGraphParams: props.updatedGraphParams })"
          />
          <Button
            v-if="showFocusBtn"
            size="small"
            label="Focus Chemical"
            class="ml-1"
            @click="focusSelectedNode"
          />
          <Button
            v-tooltip="NE_EXPLORER_RUN_BTN_TOOLTIP"
            label="GenRA"
            size="small"
            class="ml-1 mt-1 bg-green-700 border-green-700"
            severity="success"
            color="#178740"
            icon="pi pi-play-circle"
            @click="emits('startGenraFromNe', props.selectedNode.id)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type {
  ForceGraphNode, GraphType, UpdatedGraphParams, ZoomEndParams,
} from '../types';
import {
  NE_EXPLORER_RESET_BTN_TEXT, NE_EXPLORER_DOWNLOAD_BTN_TEXT, NE_EXPLORER_EXPAND_BTN_TOOLTIP,
  NE_EXPLORER_RUN_BTN_TOOLTIP, NE_EXPLORER_CHEM_INFO_NULL_MSG,
} from './constants';

const props = defineProps<{
  selectedNode: ForceGraphNode | null;
  updatedGraphParams: UpdatedGraphParams;
}>();

const emits = defineEmits<{
  startGenraFromNe: [chemId: string];
}>();

const imageUrl = () => {
  if (props.selectedNode?.id.includes('undefined') || !props.selectedNode?.id) {
    return '';
  }

  return getSvgImgUrl(props.selectedNode.id);
};

const isExpanded = computed(() => props.selectedNode?.expanded);

const userCurrentView = ref<ZoomEndParams | null>(null);
const isZooming = ref(false);

const neGraphRef = ref<GraphType | null>(null);

onMounted(() => {
  useNeGraphOn('zoom-end', (params) => {
    userCurrentView.value = params;
    setTimeout(() => {
      isZooming.value = false;
    }, 500);
  });
  useNeGraphOn('zoom-in', () => {
    isZooming.value = true;
  });

  useNeGraphOn('set-graph-ref', (gref) => {
    neGraphRef.value = gref;
  });
});

// Focus Btn
const showFocusBtn = computed(() => {
  if (!userCurrentView.value) {
    return false;
  }

  const selectedNode: ForceGraphNode | undefined = neGraphRef.value?.graphContext?.graphData().nodes
    .find(({id}) => id === props.selectedNode?.id);

  if (!selectedNode) {
    return false;
  }
  if (Math.abs(userCurrentView.value.x - selectedNode.x) <= 10 && Math.abs(userCurrentView.value.y - selectedNode.y) <= 10) {
    return false;
  }

  return !isZooming.value;
});

const focusSelectedNode = () => {
  if (props.selectedNode && showFocusBtn.value) {
    useNeGraphEvent('focus-selected-target', props.selectedNode);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
