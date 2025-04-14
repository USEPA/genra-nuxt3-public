import {
  describe, it, expect,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen, waitFor,
  within,
} from '@testing-library/vue';
import {createTestingPinia} from '@pinia/testing';
import {ToastService} from 'primevue';
import ErrorDialog from './ErrorDialog.vue';
import Index from '~/pages/[[chem_id]].vue';
import {getReadAcrossMockResponseForBpaAndTenNeighbors, runReadAcrossMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/ReadAcrossMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {assayMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/AssayMocks';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import {nExplorerResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/NeighborhoodExplorerMocks';

const defaultReadAcrossPanelInitialState = {
  appBaseStore: {
    params: GENRA_DEFAULT_PARAMS,
    setupResponse: setupMockResponseForBpa,
    currentStep: 3,
    showErrorDialog: true,
  },
  radialStore: {
    isRadialPanelLoading: false,
    radialResponse: radialMockResponseForBpaAndTenNeighbors,
    physchemPlotUrl: 'test plot str',
    neighborByOptions: setupMockResponseForBpa.neighbor_by,
    filterByOptions: setupMockResponseForBpa.filter_by,
    graphResponse: nExplorerResponseForBpaAndTenNeighbors,
  },
  fingerprintStore: {
    fingerprintResponse: fingerprintMockResponseForBpaAndTenNeighbors,
  },
  assayStore: {
    assayResponse: assayMockResponseForBpaAndTenNeighbors,
  },
  readAcrossStore: {
    readAcrossResponse: getReadAcrossMockResponseForBpaAndTenNeighbors,
    runReadAcrossResponse: runReadAcrossMockResponseForBpaAndTenNeighbors,
    isReadAcrossLoading: false,
    showSelectionChangeDialog: false,
  },
};

describe('Error Dialog', () => {
  it('tests mounts', async() => {
    await renderSuspended(ErrorDialog, {
      props: {
        show: true,
        errorMsg: 'Test Error Msg',
      },
      global: {
        plugins: [PrimeVue, ToastService],
      },
    });

    expect(screen.getByText('Test Error Msg')).toBeTruthy();
  });

  it('tests unmounting', async() => {
    await renderSuspended(Index, {
      global: {
        plugins: [
          PrimeVue, ToastService, createTestingPinia({
            initialState: defaultReadAcrossPanelInitialState,
          }),
        ],
      },
    });

    expect(screen.getByTestId('errorDialog')).toBeTruthy();

    const closeBtn = within(screen.getByTestId('errorDialog')).getByRole('button', {
      name: /Close/i,
    });
    await fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.queryByTestId('errorDialog')).toBeFalsy());
  });
});
