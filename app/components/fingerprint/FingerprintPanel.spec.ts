import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {createTestingPinia} from '@pinia/testing';
import {PrimeVue} from '@primevue/core';
import {screen} from '@testing-library/vue';
import {defaultRadialPanelInitialState} from '../radial/RadialPanel.spec';
import FingerprintPanel from './FingerprintPanel.vue';
import {FINGERPRINT_PANEL_HEADER_TEXT} from './constants';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';

export const defaultFingerprintInitialState = {
  ...defaultRadialPanelInitialState,
  appBaseStore: {
    ...defaultRadialPanelInitialState.appBaseStore,
    currentStep: 2,
  },
  fingerprintStore: {
    fingerprintResponse: fingerprintMockResponseForBpaAndTenNeighbors,
  },
};

describe('Fingerprint Panel', () => {
  it('tests mounting of panel', async() => {
    await renderSuspended(FingerprintPanel, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: defaultFingerprintInitialState,
          }), PrimeVue,
        ],
      },
    });

    expect(screen.getByText(FINGERPRINT_PANEL_HEADER_TEXT)).toBeTruthy();
  });
});
