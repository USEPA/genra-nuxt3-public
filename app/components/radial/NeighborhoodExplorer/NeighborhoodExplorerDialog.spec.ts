import {
  afterEach,
  beforeEach,
  describe, expect, it, vi,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen, within,
} from '@testing-library/vue';
import RadialPanel from '../RadialPanel.vue';
import {NE_EXPLORER_DIALOG_HEADER_TEXT} from '../constants';
import {NE_EXPLORER_BTN_TEXT} from '../RadialFooter/constants';
import {defaultRadialPanelInitialState} from '../RadialPanel.spec';
import NeighborhoodExplorerDialog from './NeighborhoodExplorerDialog.vue';
import {testDialogMountAndUnmount} from '~/test/vitest/helpers';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {nExplorerResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/NeighborhoodExplorerMocks';

describe('Neighborhood Explorer Dialog', () => {
  beforeEach(() => {
    vi.useFakeTimers({shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('tests mounting and unmounting', async() => {
    await testDialogMountAndUnmount(RadialPanel, NE_EXPLORER_DIALOG_HEADER_TEXT, NE_EXPLORER_BTN_TEXT, null, 'neExplorerDialog', null, defaultRadialPanelInitialState);
  });

  it('tests graph does not show', async() => {
    await renderSuspended(NeighborhoodExplorerDialog, {
      props: {
        show: false,
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

    expect(screen.queryByTestId('neGraphCanvas')).toBeFalsy();
  });

  it('tests help window', async() => {
    const windowSpy = vi.spyOn(window, 'open');
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

    const helpBtn = await within(screen.getByTestId('neExplorerDialog')).findByRole('button', {name: 'Click Here'});
    await fireEvent.click(helpBtn);
    expect(windowSpy).toHaveBeenCalled();
  });
});
