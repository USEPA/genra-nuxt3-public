import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {createTestingPinia} from '@pinia/testing';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen, waitFor,
} from '@testing-library/vue';
import {defaultRadialPanelInitialState} from '../radial/RadialPanel.spec';
import AssayPanel from './AssayPanel.vue';
import {
  GROUP_LABEL_TEXT, BY_LABEL_TEXT, PAGINATION_LABEL_TEXT, GENERATE_BTN_TEXT,
} from './AssayMenuBar/constants';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';
import {assayMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/AssayMocks';

export const defaultAssayInitialState = {
  ...defaultRadialPanelInitialState,
  appBaseStore: {
    ...defaultRadialPanelInitialState.appBaseStore,
    currentStep: 2,
  },
  fingerprintStore: {
    fingerprintResponse: fingerprintMockResponseForBpaAndTenNeighbors,
  },
  assayStore: {
    assayResponse: assayMockResponseForBpaAndTenNeighbors,
  },
};

describe('Assay Panel', () => {
  it('tests mounting of panel', async() => {
    await renderSuspended(AssayPanel, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: defaultAssayInitialState,
          }), PrimeVue,
        ],
      },
    });
    [
      GROUP_LABEL_TEXT,
      BY_LABEL_TEXT,
      PAGINATION_LABEL_TEXT,
      GENERATE_BTN_TEXT,
    ].forEach((label) => {
      expect(screen.getByText(label)).toBeTruthy();
    });
  });

  it('tests pagination change handler', async() => {
    await renderSuspended(AssayPanel, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: defaultAssayInitialState,
          }), PrimeVue,
        ],
      },
    });
    await fireEvent.click(screen.getByRole('switch'));
    await waitFor(() => expect(screen.getByRole('switch')).not.toBeChecked());
  });
});
