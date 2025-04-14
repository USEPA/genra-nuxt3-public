import {
  afterEach,
  beforeEach,
  describe, expect,
  it,
  vi,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen, waitFor,
} from '@testing-library/vue';
import {createTestingPinia} from '@pinia/testing';
import {ToastService} from 'primevue';
import Index from './[[chem_id]].vue';
import {mockAllGenRAEndpointsWithBpaAndTenNeighbors} from '~/test/vitest/helpers';

const expandCollapseHeaderAndFooterBtn = () => screen.getByLabelText('Click to hide EPA header');
mockAllGenRAEndpointsWithBpaAndTenNeighbors();

describe('Index page', () => {
  beforeEach(() => {
    vi.useFakeTimers({shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('tests app mounts', async() => {
    await renderSuspended(Index, {
      global: {
        plugins: [
          PrimeVue, ToastService, createTestingPinia({
            initialState: {
              appBaseStore: {
                currentStep: 0,
              },
            },
          }),
        ],
        stubs: {
          teleport: true,
        },
      },
    });
    expect(screen.getByText('Environmental Topics')).toBeTruthy();
  });

  it('tests epa header and footer', async() => {
    await renderSuspended(Index, {
      global: {
        plugins: [
          PrimeVue, ToastService, createTestingPinia({
            initialState: {
              appBaseStore: {
                currentStep: 0,
              },
            },
          }),
        ],
      },
    });
    expect(screen.getByText('Environmental Topics')).toBeTruthy();
    expect(expandCollapseHeaderAndFooterBtn()).toBeTruthy();
    await fireEvent.click(expandCollapseHeaderAndFooterBtn());
    await waitFor(() => expect(screen.queryByText('Environmental Topics')).toBeFalsy());
  });
});
