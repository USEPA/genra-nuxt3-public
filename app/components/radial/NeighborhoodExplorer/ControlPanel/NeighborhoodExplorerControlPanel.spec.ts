import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen, waitFor, within,
} from '@testing-library/vue';
import NeighborhoodExplorerControlPanel from './NeighborhoodExplorerControlPanel.vue';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import type {RadialViewResponseItem} from '~/api/types';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import type {Dtxcid, Dtxsid} from '~~/types';

const selectedNode = radialMockResponseForBpaAndTenNeighbors.result.length &&
  radialMockResponseForBpaAndTenNeighbors.result.length > 1 ?
  radialMockResponseForBpaAndTenNeighbors.result[1] as RadialViewResponseItem :
  {} as RadialViewResponseItem;

const defaultRenderOptions = {
  props: {
    selectedNode: {
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
    },
    setupResponse: setupMockResponseForBpa,
  },
  global: {
    plugins: [PrimeVue],
    stubs: {
      teleport: true,
    },
  },
};

describe('Control Panel', () => {
  it('tests render with selected node', async() => {
    await renderSuspended(NeighborhoodExplorerControlPanel, defaultRenderOptions);
    expect(screen.findByText(selectedNode?.name)).toBeTruthy();
  });

  it('tests render with out a selected filter by and graph type', async() => {
    await renderSuspended(NeighborhoodExplorerControlPanel, {
      ...defaultRenderOptions,
      props: {
        ...defaultRenderOptions.props,
        setupResponse: {
          ...defaultRenderOptions.props.setupResponse,
          filter_by: [],
          graph_type: [],
        },
      },
    });
    expect(screen.findByText(selectedNode?.name)).toBeTruthy();
  });

  it('tests all actions', async() => {
    // Run from chem info
    await renderSuspended(NeighborhoodExplorerControlPanel, defaultRenderOptions);
    await fireEvent.click(within(screen.getByTestId('chemInfoContainer')).getByRole('button', {name: 'GenRA'}));

    // Run from custom
    const expandBtn = screen.getByRole('button', {name: 'Custom Neighborhood'});
    await fireEvent.click(expandBtn);
    const addBtn = screen.getByLabelText(`add ${selectedNode.name} to custom neighborhood`);
    await fireEvent.click(addBtn);
    await fireEvent.click(within(screen.getByTestId('customNeighborhoodContainer')).getByRole('button', {name: 'GenRA'}));

    // Update
    const updateBtn = () => screen.getByRole('button', {name: 'Update'});
    const firstUnselectedSwitch = setupMockResponseForBpa.neighbor_by.filter(({key}) => key !== 'hybrid').findIndex(({key}) => !setupMockResponseForBpa.initGraphFPs.includes(key));
    if (firstUnselectedSwitch) {
      await fireEvent.click(updateBtn());
      await fireEvent.click(screen.getAllByRole('switch')[firstUnselectedSwitch] as HTMLElement);
      await waitFor(() => expect(updateBtn()).not.toBeDisabled());
      await fireEvent.click(updateBtn());
    }
  });
});
