<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12">
      <ChemicalInformation
        :selected-node="props.selectedNode"
        :updated-graph-params="updatedGraphParams"
        data-testid="chemInfoContainer"
        @start-genra-from-ne="startGenraFromChemicalInfo"
      />
    </div>
    <div
      v-if="props.selectedNode"
      class="col-span-12"
    >
      <CustomNeighborhood
        :selected-node="props.selectedNode"
        data-testid="customNeighborhoodContainer"
        @start-genra-from-ne="startGenraFromCustomNn"
      />
    </div>
    <div class="col-span-12">
      <Fingerprints
        :setup-response="props.setupResponse"
        :updated-graph-params="updatedGraphParams"
        @update="update"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  UpdatedGraphParams,
  ForceGraphNode,
} from '../types';
import ChemicalInformation from './ChemicalInformation.vue';
import CustomNeighborhood from './CustomNeighborhood.vue';
import Fingerprints from './Fingerprints.vue';
import type {StartGenraFromNeParams} from '~/stores/radial/types';
import type {SetupResponse} from '~/api/types';

const props = defineProps<{
  selectedNode: ForceGraphNode | null;
  setupResponse: SetupResponse | Record<string, never>;
}>();

const emits = defineEmits<{
  startGenraFromNe: [params: StartGenraFromNeParams];
}>();

/** Chemical Info */
const startGenraFromChemicalInfo = (chemId: string) => {
  emits('startGenraFromNe', {chemId, fromCustomNn: false});
};

/** Custom NN */
const startGenraFromCustomNn = (customList: string[]) => {
  customList.unshift(props.setupResponse.chem_id);
  const chemIds = customList.join(',');
  emits('startGenraFromNe', {chemId: chemIds, fromCustomNn: true});
};

/** Fingerprints */
// Used to keep track of updated graph params through multiple updates. Needed for expand as well.
const updatedGraphParams = ref<UpdatedGraphParams>({
  filterBy: '',
  graphType: '',
  fingerprints: [] as string[],
});

// Sync with setupResponse on mount and keep separate from Radial/other app params.
onMounted(() => {
  updatedGraphParams.value.filterBy = props.setupResponse.filter_by[0]?.key || '';
  updatedGraphParams.value.graphType = props.setupResponse.graph_type[0]?.key || '';
  updatedGraphParams.value.fingerprints = props.setupResponse.initGraphFPs;
});

// Update
const update = (params: UpdatedGraphParams) => {
  updatedGraphParams.value = params;
  useNeGraphEvent('update-graph', {
    updatedGraphParams: params,
    selectedNode: props.selectedNode,
  });
};
</script>
