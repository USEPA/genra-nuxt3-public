import {renderSuspended} from '@nuxt/test-utils/runtime';
import {PrimeVue} from '@primevue/core';
import {
  describe, expect, it,
} from 'vitest';
import {
  fireEvent, screen, waitFor, within,
} from '@testing-library/vue';
import NeighborhoodExplorerDialog from '../NeighborhoodExplorerDialog.vue';
import CustomNeighborhood from './CustomNeighborhood.vue';
import {nExplorerResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/NeighborhoodExplorerMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import type {RadialViewResponseItem} from '~/api/types';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import type {Dtxcid, Dtxsid} from '~~/types';

const selectedNode = radialMockResponseForBpaAndTenNeighbors.result.length ?
  radialMockResponseForBpaAndTenNeighbors.result[1] as RadialViewResponseItem :
  {} as RadialViewResponseItem;

describe('Custom Neighborhood', () => {
  it('tests component visibility', async() => {
    await renderSuspended(NeighborhoodExplorerDialog, {
      props: {
        show: true,
        params: GENRA_DEFAULT_PARAMS,
        neExplorerHelpText: 'test',
        setupResponse: setupMockResponseForBpa,
        graphResponse: nExplorerResponseForBpaAndTenNeighbors,
      },
      global: {
        plugins: [PrimeVue],
        stubs: {
          teleport: true,
        },
      },
    });
    expect(screen.queryByText('Custom Neighborhood')).toBeFalsy();
  });

  it('tests component is mounted when node is selected', async() => {
    await renderSuspended(CustomNeighborhood, {
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
      },
    });
    const addBtn = screen.getByLabelText(`add ${selectedNode.name} to custom neighborhood`);
    expect(addBtn).not.toBeDisabled();
  });

  it('tests add functionality', async() => {
    await renderSuspended(CustomNeighborhood, {
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
      },
    });

    const expandBtn = screen.getByRole('button', {name: 'Custom Neighborhood'});
    await fireEvent.click(expandBtn);
    const addBtn = screen.getByLabelText(`add ${selectedNode.name} to custom neighborhood`);
    expect(addBtn).not.toBeDisabled();
    await fireEvent.click(addBtn);
    expect(within(screen.getByRole('listbox')).findByText(selectedNode.name)).toBeTruthy();
  });

  it('tests remove', async() => {
    await renderSuspended(CustomNeighborhood, {
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
      },
    });
    const expandBtn = screen.getByRole('button', {name: 'Custom Neighborhood'});
    await fireEvent.click(expandBtn);
    const addBtn = screen.getByLabelText(`add ${selectedNode.name} to custom neighborhood`);
    await fireEvent.click(addBtn);

    const removeBtn = () => screen.getByLabelText(`remove ${selectedNode.name} from custom neighborhood`);

    expect(removeBtn()).toBeDisabled();
    await fireEvent.click(removeBtn());
    const listItemToRemove = await within(screen.getByRole('listbox')).findByText(selectedNode.name);
    await fireEvent.click(listItemToRemove);
    expect(removeBtn()).not.toBeDisabled();
    await fireEvent.click(removeBtn());

    await waitFor(() => expect(within(screen.getByRole('listbox')).queryByText(selectedNode.name)).toBeFalsy());
  });

  it('tests run GenRA', async() => {
    await renderSuspended(CustomNeighborhood, {
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
      },
    });

    const expandBtn = screen.getByRole('button', {name: 'Custom Neighborhood'});
    await fireEvent.click(expandBtn);

    const runBtn = () => screen.getByRole('button', {name: 'GenRA'});
    await fireEvent.click(runBtn());
    expect(runBtn()).toBeDisabled();

    const addBtn = screen.getByLabelText(`add ${selectedNode.name} to custom neighborhood`);
    await fireEvent.click(addBtn);

    expect(runBtn()).not.toBeDisabled();

    await fireEvent.click(runBtn());
  });
});
