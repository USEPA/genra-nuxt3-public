import {
  afterEach,
  beforeEach,
  describe, expect, it,
  vi,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen,
  waitFor,
} from '@testing-library/vue';
import type {GraphType, UpdatedGraphParams} from '../types';
import ChemicalInformation from './ChemicalInformation.vue';
import {
  NE_EXPLORER_CHEM_INFO_NULL_MSG, NE_EXPLORER_DOWNLOAD_BTN_TEXT, NE_EXPLORER_RESET_BTN_TEXT,
} from './constants';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {itif} from '~/test/vitest/helpers';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import type {RadialViewResponseItem} from '~/api/types';
import type {Dtxcid, Dtxsid} from '~~/types';
import {mockGraphRef} from '~/test/vitest/mockData/lib/MockGraphData';

vi.mock('file-saver', async(importOriginal) => {
  const mod = await importOriginal<typeof import('file-saver')>();
  return {
    ...mod,
    saveAs: vi.fn(),
  };
});

const defaultUpdatedGraphParams: UpdatedGraphParams = {
  filterBy: setupMockResponseForBpa.filter_by?.[0]?.key ?? '',
  graphType: setupMockResponseForBpa.graph_type?.[0]?.key ?? '',
  fingerprints: setupMockResponseForBpa.neighbor_by.map(({key}) => key),
};

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
    updatedGraphParams: defaultUpdatedGraphParams,
  },
  global: {
    plugins: [PrimeVue],
    stubs: {
      teleport: true,
    },
  },
};

describe('Chemical Information', () => {
  beforeEach(() => {
    vi.useFakeTimers({shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('tests chemical not shown on mount', async() => {
    await renderSuspended(ChemicalInformation, {
      props: {
        selectedNode: null,
        updatedGraphParams: defaultUpdatedGraphParams,
      },
      global: {...defaultRenderOptions.global},
    });
    expect(screen.getByText(NE_EXPLORER_CHEM_INFO_NULL_MSG)).toBeTruthy();
  });

  itif(radialMockResponseForBpaAndTenNeighbors.result.length > 1)('tests selected chemical display info', async() => {
    await renderSuspended(ChemicalInformation, {
      ...defaultRenderOptions,
    });
    [selectedNode.weight, selectedNode.name, selectedNode.dtxcid, selectedNode.dtxsid].forEach((val) => {
      expect(screen.getByText(val)).toBeTruthy();
    });
  });

  it('tests chem without an image', async() => {
    await renderSuspended(ChemicalInformation, {
      ...defaultRenderOptions,
      props: {
        ...defaultRenderOptions.props,
        selectedNode: {
          ...defaultRenderOptions.props.selectedNode,
          id: 'undefined' as Dtxcid | Dtxsid,
        },
      },
    });
    [selectedNode.weight, selectedNode.name, selectedNode.dtxcid, selectedNode.dtxsid].forEach((val) => {
      expect(screen.getByText(val)).toBeTruthy();
    });
  });

  it('tests reset, download, and expand', async() => {
    await renderSuspended(ChemicalInformation, {
      ...defaultRenderOptions,
    });

    // No expect here - actual tests of interactions to be done on graph (where events are recieved)
    const resetBtn = screen.getByLabelText(NE_EXPLORER_RESET_BTN_TEXT);
    await fireEvent.click(resetBtn);

    const downloadBtn = screen.getByLabelText(NE_EXPLORER_DOWNLOAD_BTN_TEXT);
    await fireEvent.click(downloadBtn);

    const expandBtn = screen.getByText('Expand');
    await fireEvent.click(expandBtn);

    const runBtn = screen.getByRole('button', {name: 'GenRA'});
    await fireEvent.click(runBtn);
  });

  it('tests graph events', async() => {
    await renderSuspended(ChemicalInformation, {
      ...defaultRenderOptions,
    });

    useNeGraphEvent('zoom-end', {
      x: 3,
      k: 2,
      y: 1,
    });

    useNeGraphEvent('zoom-in');

    useNeGraphEvent('set-graph-ref', mockGraphRef as unknown as GraphType);
  });

  it('tests clicking focus chemical btn', async() => {
    await renderSuspended(ChemicalInformation, {
      ...defaultRenderOptions,
    });

    useNeGraphEvent('set-graph-ref', mockGraphRef as unknown as GraphType);
    useNeGraphEvent('zoom-end', {
      x: 3,
      k: 2,
      y: 1,
    });
    vi.runAllTimers();

    const focusBtn = () => screen.queryByRole('button', {name: 'Focus Chemical'});
    await waitFor(() => expect(focusBtn()).toBeTruthy());
    await fireEvent.click(focusBtn() as HTMLElement);
  });
});
