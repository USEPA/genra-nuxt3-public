<template>
  <div
    id="force-graph-container"
    ref="neExplorerContainerRef"
    class="w-full h-full"
  >
    <VueForceGraph2D
      ref="graphRef"
      :graph-data="graphData"
      :height="height"
      :width="width"
      data-testid="neGraphCanvas"
      link-curvature="curvature"
      :link-directional-arrow-length="8"
      :link-directional-arrow-rel-pos="1"
      :cooldown-time="3000"
      link-directional-arrow-color="black"
      :auto-pause-redraw="false"
      :node-color="getNodeColor"
      :link-width="(edge: ForceGraphEdge) => getEdgeWith(edge.similarity)"
      :link-color="(edge: ForceGraphEdge) => getLinkColor(edge.type)"
      :node-label="getNodeLabel"
      link-label="similarity"
      :on-node-click="(node: ForceGraphNode) => onNodeClick(node)"
      :node-canvas-object-mode="getNodeCanvasObjectMode"
      :node-canvas-object="getNodeCanvasObject"
      :on-node-drag="(node: ForceGraphNode) => onNodeDrag(node, graphRef!.graphContext!.graphData())"
      :on-node-drag-end="(node: ForceGraphNode) => onNodeDragEnd(node)"
      :on-zoom-end="onZoomEnd"
      :on-zoom="onZoom"
    />
  </div>
</template>

<script setup lang="ts">
import {VueForceGraph2D} from 'vue-force-graph';
import fileSaver from 'file-saver';
import type {
  ExpandNodeParams,
  ForceGraphData,
  ForceGraphEdge,
  ForceGraphNode, GraphData,
  GraphType,
  ZoomEndParams,
} from '../types';
import {
  convertApiResponseToGraphData, getEdgeWith, getNodeColor, getLinkColor,
  getNodeLabel,
  getNodeCanvasObjectMode,
  getNodeCanvasObject,
  onNodeDrag,
  onNodeDragEnd,
  convertGraphDataToDownloadObj,
  mergeGraphData,
  graphDataIsEmpty,
} from './helpers';
import {DEFAULT_GRAPH_NEIGHBORS} from './constants';
import type {NeighborhoodGraphResponse, SetupResponse} from '~/api/types';
import type {Dtxcid, Dtxsid} from '~~/types';

const props = defineProps<{
  graphResponse: NeighborhoodGraphResponse | undefined;
  params: Params;
  setupResponse: SetupResponse | Record<string, never>;
}>();

const emits = defineEmits<{
  onNodeSelect: [node: ForceGraphNode | null];
  onZoomEnd: [params: ZoomEndParams];
  setUserCurrentView: [view: ZoomEndParams];
  updateGraphDisabledHandler: [isDisabled: boolean];
  expandSelectedNode: [isExpanded: boolean];
}>();

const graphRef = ref<GraphType | null>(null);
const neExplorerContainerRef = ref();

watch(() => graphRef.value, (newVal: GraphType | null) => {
  useNeGraphEvent('set-graph-ref', newVal);
});

const graphData = ref<ForceGraphData | GraphData>({
  nodes: [],
  links: [],
});

const lastKnownGraphData = ref<ForceGraphData | GraphData>({
  nodes: [],
  links: [],
});

// Graph Events - these are called from other components to interactive with the graph canvas
const s0 = computed(() => props.params.s0);
const targetChemId = computed(() => props.params.chem_id);
onMounted(() => {
  useNeGraphOn('focus-selected-target', (node: ForceGraphNode) => {
    const selectedNode: ForceGraphNode | undefined = graphRef.value?.graphContext?.graphData().nodes
      .find(({id}) => id === node?.id);
    if (selectedNode) {
      focusNode(selectedNode);
    }
  });

  useNeGraphOn('reset-graph-layout', () => {
    graphRef.value?.graphContext?.graphData(structuredClone(toRaw(lastKnownGraphData.value)) as ForceGraphData);
  });

  useNeGraphOn('download', () => {
    const downloadObj = convertGraphDataToDownloadObj(graphData.value as ForceGraphData);
    const downloadBlob = new Blob([JSON.stringify(downloadObj)]);
    fileSaver.saveAs(downloadBlob, `genra_${getDateTimeForNeExport().value}.json`);
  });

  useNeGraphOn('expand-selected-node', async(params: ExpandNodeParams) => {
    emits('updateGraphDisabledHandler', true);
    const {$repositores} = useNuxtApp();
    const node = params.selectedNode;
    const expandedData = await $repositores.genra.getNeighborhoodGraph({
      ...props.params,
      s0: s0.value,
      sel_by: params.updatedGraphParams.filterBy,
      k0: DEFAULT_GRAPH_NEIGHBORS,
      graph_type: params.updatedGraphParams.graphType,
      steps: 1,
      chem_id: node.id,
      fp: params.updatedGraphParams.fingerprints.join(','),
    });
    const currentGraphData = graphRef.value?.graphContext?.graphData() as ForceGraphData;
    const convertedExpandedData = convertApiResponseToGraphData(expandedData, targetChemId.value);
    mergeGraphData(currentGraphData, convertedExpandedData);

    graphRef?.value?.graphContext?.cooldownTime(5000);
    graphRef.value?.graphContext?.graphData(currentGraphData);
    lastKnownGraphData.value = structuredClone(toRaw(currentGraphData));
    graphRef.value?.graphContext?.onEngineStop(() => {
      focusNode(node);
      emits('updateGraphDisabledHandler', false);
      emits('expandSelectedNode', true);
    });
  });

  useNeGraphOn('update-graph', async(params) => {
    try {
      emits('updateGraphDisabledHandler', true);
      graphRef?.value?.graphContext?.zoomToFit(1000);
      const {$repositores} = useNuxtApp();
      const updatedData = await $repositores.genra.getNeighborhoodGraph({
        ...props.params,
        k0: DEFAULT_GRAPH_NEIGHBORS,
        s0: s0.value,
        fp: params.updatedGraphParams.fingerprints.join(','),
        sel_by: params.updatedGraphParams.filterBy,
        graph_type: params.updatedGraphParams.graphType,
        steps: 3,
        chem_id: props.setupResponse.chem_id,
      });

      const isCurrentlySelectedNodeInResponse =
        Object.keys(updatedData.nodes)?.includes(params.selectedNode?.id as Dtxcid | Dtxsid);

      if (graphDataIsEmpty(updatedData)) {
        emits('updateGraphDisabledHandler', false);
      } else {
        graphRef?.value?.graphContext?.onEngineStop(() => {
          emits('updateGraphDisabledHandler', false);
          if (isCurrentlySelectedNodeInResponse) {
            useNeGraphEvent('focus-selected-target', params.selectedNode as ForceGraphNode);
          }
        });
      }
      if (!isCurrentlySelectedNodeInResponse) {
        emits('onNodeSelect', null);
      }

      const data = isCurrentlySelectedNodeInResponse ?
        focusNode(params.selectedNode as ForceGraphNode, 2000,
          convertApiResponseToGraphData(updatedData, props.setupResponse.chem_id)) as ForceGraphData :
        convertApiResponseToGraphData(updatedData, props.setupResponse.chem_id);

      const isCurrentNodeExpanded = !!data.nodes.find(({id}) => id === params.selectedNode?.id)?.expanded;
      emits('expandSelectedNode', isCurrentNodeExpanded);
      lastKnownGraphData.value = structuredClone(toRaw(data));
      graphRef?.value?.graphContext?.cooldownTime(5000);
      graphRef?.value?.graphContext?.graphData(data);
    } catch {
      emits('updateGraphDisabledHandler', false);
    }
  });
});

onMounted(() => {
  if (props.graphResponse) {
    const data = convertApiResponseToGraphData(props.graphResponse, targetChemId.value);
    graphData.value = data;
    lastKnownGraphData.value = structuredClone(toRaw(data));
  }

  /* istanbul ignore next -- @preserve */
  useResizeObserver(neExplorerContainerRef, (entries) => {
    try {
      const entry = entries[0];
      const {
        width,
      } = entry!.contentRect;
      if (graphRef.value?.graphContext) {
        resetWidth(width);
      }
    } catch {
      // ignore error
    }
  });
});

const height = computed(() => {
  const containerEle = document.getElementById('force-graph-container');
  return containerEle?.getBoundingClientRect()?.height;
});

const width = computed(() => {
  const containerEle = document.getElementById('force-graph-container');
  return containerEle?.getBoundingClientRect()?.width;
});

/* istanbul ignore next -- @preserve */
const resetWidth = (newWidth: number | null) => {
  const containerEle = document.getElementById('force-graph-container');
  if (containerEle) {
    nextTick(() => {
      const inputWidth = newWidth || containerEle?.getBoundingClientRect()?.width;
      graphRef.value?.graphContext?.width(inputWidth);
    });
  }
};

const focusNode = (node: ForceGraphNode, delay: number = 2000, data?: ForceGraphData | GraphData) => {
  graphRef.value?.graphContext?.centerAt(node.x, node.y, 1000);
  graphRef.value?.graphContext?.zoom(3, delay);
  const dataToTranslate = data || graphRef.value?.graphContext?.graphData();
  if (dataToTranslate) {
    const {nodes, links} = dataToTranslate;
    if (nodes) {
      nodes.forEach((dataNode) => {
        dataNode.isViewing = dataNode.id === node.id;
      });
    }

    return {
      links,
      nodes,
    };
  }
  return null;
};

// Graph Actions
const onNodeClick = (node: ForceGraphNode) => {
  focusNode(node);

  emits('onNodeSelect', node);
};

const onZoomEnd = (params: ZoomEndParams) => {
  useNeGraphEvent('zoom-end', params);
};
const onZoom = () => {
  useNeGraphEvent('zoom-in');
};
</script>
