import {
  describe, expect, it,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {createTestingPinia} from '@pinia/testing';
import {PrimeVue} from '@primevue/core';
import {screen} from '@testing-library/vue';
import RadialPanel from './RadialPanel.vue';
import {
  NEIGHBORS_BY_LABEL_TEXT, FILTER_BY_LABEL_TEXT, DOWNLOAD_LABEL_TEXT,
} from './RadialMenuBar/constants';
import {
  PHYSCHEM_PLOT_BTN_TEXT, NE_EXPLORER_BTN_TEXT, NEXT_BTN_TEXT,
} from './RadialFooter/constants';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {nExplorerResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/NeighborhoodExplorerMocks';

export const defaultRadialPanelInitialState = {
  radialStore: {
    isRadialPanelLoading: false,
    radialResponse: radialMockResponseForBpaAndTenNeighbors,
    physchemPlotUrl: 'test plot str',
    neighborByOptions: setupMockResponseForBpa.neighbor_by,
    filterByOptions: setupMockResponseForBpa.filter_by,
    graphResponse: nExplorerResponseForBpaAndTenNeighbors,
  },
  appBaseStore: {
    params: GENRA_DEFAULT_PARAMS,
    currentStep: 1,
    setupResponse: setupMockResponseForBpa,
  },
};

const defaultGlobalSettings = {
  plugins: [
    createTestingPinia({
      initialState: defaultRadialPanelInitialState,
    }), PrimeVue,
  ],
  stubs: {
    teleport: true,
  },
};

describe('Radial Panel', () => {
  it('test panel mounts', async() => {
    await renderSuspended(RadialPanel, {
      global: defaultGlobalSettings,
    });
    [NEIGHBORS_BY_LABEL_TEXT, FILTER_BY_LABEL_TEXT, DOWNLOAD_LABEL_TEXT].forEach((label) => {
      expect(screen.getByText(label)).toBeTruthy();
    });

    [PHYSCHEM_PLOT_BTN_TEXT, NE_EXPLORER_BTN_TEXT, NEXT_BTN_TEXT].forEach((btnLabel) => {
      expect(screen.getByRole('button', {name: btnLabel})).toBeTruthy();
    });
  });
});
