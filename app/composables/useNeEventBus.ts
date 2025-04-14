import mitt from 'mitt';
import type {
  ExpandNodeParams,
  ForceGraphNode, GraphType, UpdatedGraphParams, ZoomEndParams,
} from '~/components/radial/NeighborhoodExplorer/types';

export type GraphEvents = {
  'zoom-in': undefined;
  'zoom-end': ZoomEndParams;
  'set-graph-ref': GraphType | null;
  'focus-selected-target': ForceGraphNode;
  'reset-graph-layout': undefined;
  'expand-selected-node': ExpandNodeParams;
  'update-graph': {
    updatedGraphParams: UpdatedGraphParams;
    selectedNode: ForceGraphNode | null;
  };
  download: undefined;
};

export const emitter = mitt<GraphEvents>();

export const useNeGraphEvent = emitter.emit;
export const useNeGraphOn = emitter.on;
