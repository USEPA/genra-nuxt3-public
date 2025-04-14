import {
  describe, expect, it,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen,
} from '@testing-library/vue';
import RadialFooter from './RadialFooter.vue';
import {nExplorerResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/NeighborhoodExplorerMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';

describe('Radial Footer', () => {
  it('tests Footer mounting', async() => {
    await renderSuspended(RadialFooter, {
      props: {
        isRadialLoading: false,
        currentStep: 1,
        isNextDisabled: false,
        graphResponse: nExplorerResponseForBpaAndTenNeighbors,
        neExplorerHelpText: '',
        setupResponse: setupMockResponseForBpa,
        params: GENRA_DEFAULT_PARAMS,
        physchemPlotUrl: '',
      },
      global: {
        stubs: {
          teleport: true,
        },
        plugins: [PrimeVue],
      },
    });
    ['Analogues:', 'Physchem Data', 'Neighborhood Exploration'].forEach((title) => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  it('tests footer loading state', async() => {
    await renderSuspended(RadialFooter, {
      props: {
        isRadialLoading: true,
        currentStep: 1,
        isNextDisabled: true,
        graphResponse: nExplorerResponseForBpaAndTenNeighbors,
        neExplorerHelpText: '',
        setupResponse: setupMockResponseForBpa,
        params: GENRA_DEFAULT_PARAMS,
        physchemPlotUrl: '',
      },
      global: {
        stubs: {
          teleport: true,
        },
        plugins: [PrimeVue],
      },
    });
  });

  it('tests next button', async() => {
    await renderSuspended(RadialFooter, {
      props: {
        isRadialLoading: false,
        currentStep: 1,
        isNextDisabled: false,
        graphResponse: nExplorerResponseForBpaAndTenNeighbors,
        neExplorerHelpText: '',
        setupResponse: setupMockResponseForBpa,
        params: GENRA_DEFAULT_PARAMS,
        physchemPlotUrl: '',
      },
      global: {
        stubs: {
          teleport: true,
        },
        plugins: [PrimeVue],
      },
    });
    await fireEvent.click(screen.getByText('Next'));
  });
});
