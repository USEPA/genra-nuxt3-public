import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
  vi,
} from 'vitest';
import {PrimeVue} from '@primevue/core';
import {screen} from '@testing-library/vue';
import type {UpdatedGraphParams} from '../types';
import NeighborhoodExplorerGraph from './NeighborhoodExplorerGraph.vue';
import {nExplorerResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/NeighborhoodExplorerMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import type {RadialViewResponseItem} from '~/api/types';
import type {Dtxcid, Dtxsid} from '~~/types';
import {mockGenraEndpoint} from '~/test/vitest/helpers';

const selectedNode = radialMockResponseForBpaAndTenNeighbors.result.length ?
  radialMockResponseForBpaAndTenNeighbors.result[1] as RadialViewResponseItem :
  {} as RadialViewResponseItem;

const forceGraphNode = {
  ...selectedNode,
  mol_weight: selectedNode?.weight || 0,
  vx: 3,
  vy: 4,
  x: 3,
  y: 4,
  id: selectedNode.chem_id as Dtxcid | Dtxsid,
  index: 4,
  __indexColor: '424',
  dsstox_cid: selectedNode.dtxcid,
  dsstox_sid: selectedNode.dtxsid,
};

const defaultUpdatedGraphParams: UpdatedGraphParams = {
  filterBy: setupMockResponseForBpa.filter_by?.[0]?.key ?? '',
  graphType: setupMockResponseForBpa.graph_type?.[0]?.key ?? '',
  fingerprints: setupMockResponseForBpa.neighbor_by.map(({key}) => key),
};

mockGenraEndpoint('NEXPLORER', nExplorerResponseForBpaAndTenNeighbors);

describe('NE Explorer Graph', () => {
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(),
    revokeObjectURL: vi.fn(),
  });
  it('tests mounting the graph', async() => {
    await renderSuspended(NeighborhoodExplorerGraph, {
      props: {
        graphResponse: nExplorerResponseForBpaAndTenNeighbors,
        params: GENRA_DEFAULT_PARAMS,
        setupResponse: setupMockResponseForBpa,
      },
      global: {
        plugins: [PrimeVue],
        stubs: {
          teleport: true,
        },
      },
    });
    expect(screen.getByTestId('neGraphCanvas')).toBeTruthy();
  });

  it('tests events', async() => {
    await renderSuspended(NeighborhoodExplorerGraph, {
      props: {
        graphResponse: nExplorerResponseForBpaAndTenNeighbors,
        params: GENRA_DEFAULT_PARAMS,
        setupResponse: setupMockResponseForBpa,
      },
      global: {
        plugins: [PrimeVue],
        stubs: {
          teleport: true,
        },
      },
    });

    useNeGraphEvent('focus-selected-target', forceGraphNode);

    useNeGraphEvent('download');

    useNeGraphEvent('expand-selected-node', {
      selectedNode: forceGraphNode,
      updatedGraphParams: defaultUpdatedGraphParams,
    });

    useNeGraphEvent('update-graph', {
      selectedNode: forceGraphNode,
      updatedGraphParams: defaultUpdatedGraphParams,
    });
  });
});
