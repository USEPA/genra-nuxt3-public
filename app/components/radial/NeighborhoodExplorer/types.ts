import type {VueForceGraph2D} from 'vue-force-graph';
import type {
  BaseChemical, BaseGraphNode, NeighborhoodGraphEdge,
} from '~/api/types';
import type {Dtxcid, Dtxsid} from '~~/types';

export interface GraphLink extends NeighborhoodGraphEdge {
  source: string;
  target: string;
  nodePairId?: string;
  curvature?: number;
}

export interface GraphNode extends BaseGraphNode {
  isTarget?: boolean;
  id: Dtxsid | Dtxcid;
  isTargetNeighbor?: boolean;
  isViewing?: boolean;
}

interface BaseForceGraphObj {
  index: number;
  __indexColor?: string;
}

export interface ForceGraphNode extends Omit<GraphNode, 'expanded'>, BaseForceGraphObj, Pick<BaseChemical, 'name' | 'dsstox_cid' | 'dsstox_sid'> {
  expanded?: boolean;
  mol_weight: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
  isViewing?: boolean;
  x: number;
  y: number;
}

export interface ForceGraphEdge extends Pick<GraphLink, 'nodePairId'>, BaseForceGraphObj {
  from: string;
  similarity: number;
  source: ForceGraphNode;
  step: number;
  target: ForceGraphNode;
  to: string;
  type: string;
  __controlPoints?: null;
}

export interface ForceGraphData {
  nodes: ForceGraphNode[];
  links: ForceGraphEdge[];
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface GraphContext {
  // eslint-disable-next-line no-unused-vars
  width: (num: number) => void;
  // eslint-disable-next-line no-unused-vars
  graphData: (data?: ForceGraphData | GraphData) => ForceGraphData;
  // eslint-disable-next-line no-unused-vars
  centerAt: (x: number, y: number, ms?: number) => void;
  // eslint-disable-next-line no-unused-vars
  zoom: (zoomNum: number, delay?: number) => void;
  // eslint-disable-next-line no-unused-vars
  onEngineStop: (fn: () => void) => void;
  // eslint-disable-next-line no-unused-vars
  zoomToFit: (ms: number, px?: number, nodeFilterFn?: (node: ForceGraphNode) => boolean) => void;
  // eslint-disable-next-line no-unused-vars
  cooldownTime: (ms: number) => void;
}

export interface ZoomEndParams {
  x: number;
  y: number;
  k: number;
}

export type GraphType = InstanceType<typeof VueForceGraph2D> & {
  graphContext: GraphContext;
};

export interface DownloadGraphData {
  nodes: Pick<ForceGraphNode, 'dsstox_sid' | 'dsstox_cid' | 'name' | 'mol_weight' | 'expanded' | 'isTarget'>[];
  edges: Pick<ForceGraphEdge, 'from' | 'to' | 'step' | 'similarity' | 'type'>[];
}

export interface UpdatedGraphParams {
  filterBy: string;
  graphType: string;
  fingerprints: string[];
}

export interface ExpandNodeParams {
  selectedNode: ForceGraphNode; updatedGraphParams: UpdatedGraphParams;
}
