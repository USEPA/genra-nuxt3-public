import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  afterEach,
  beforeEach,
  describe, expect, it,
  vi,
} from 'vitest';
import {PrimeVue} from '@primevue/core';
import {ToastService} from 'primevue';
import {screen} from '@testing-library/vue';
import HideEpaHeaderAndFooterToast from './HideEpaHeaderAndFooterToast.vue';
import {HIDE_EPA_HEADER_FOOTER_MSG} from './constants';

describe('Hide Header and Footer Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers({shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('tests state when epa header and footer is hidden', async() => {
    await renderSuspended(HideEpaHeaderAndFooterToast, {
      props: {
        showEpaHeaderAndFooter: false,
      },
      global: {
        plugins: [PrimeVue, ToastService],
      },
    });
    expect(screen.queryByText(HIDE_EPA_HEADER_FOOTER_MSG)).toBeFalsy();
  });

  it('tests showing toast on initial mount', async() => {
    await renderSuspended(HideEpaHeaderAndFooterToast, {
      props: {
        showEpaHeaderAndFooter: true,
      },
      global: {
        plugins: [PrimeVue, ToastService],
        stubs: {
          teleport: true,
        },
      },
    });
    vi.useFakeTimers({shouldAdvanceTime: true});
    await vi.runAllTimersAsync();
    expect(screen.getByTestId('hideEpaAndFooterToast')).toBeTruthy();
  });
});
