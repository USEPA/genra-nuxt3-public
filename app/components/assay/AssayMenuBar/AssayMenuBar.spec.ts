import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {PrimeVue} from '@primevue/core';
import {createTestingPinia} from '@pinia/testing';
import {
  fireEvent, screen, waitFor,
  within,
} from '@testing-library/vue';
import AssayMenuBar from './AssayMenuBar.vue';
import {
  BY_LABEL_TEXT, GROUP_LABEL_TEXT, PAGINATION_LABEL_TEXT, GENERATE_BTN_TEXT,
} from './constants';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';

const defaultRenderOptions = {
  props: {
    assayInputOptions: radialMockResponseForBpaAndTenNeighbors.report_db,
    summarise: GENRA_DEFAULT_PARAMS.summarise,
    sumrsBy: GENRA_DEFAULT_PARAMS.sumrs_by,
    currentStep: 2,
    paginate: true,
    isReadAcrossLoading: false,
    isReadAcrossPanelAvailable: true,
  },
  global: {
    plugins: [
      PrimeVue, createTestingPinia({
        initialState: {
          appBaseStore: {
            params: GENRA_DEFAULT_PARAMS,
            setupResponse: setupMockResponseForBpa,
          },
        },
      }),
    ],
    stubs: {
      teleport: true,
    },
  },
};

describe('Assay Menu Bar', () => {
  it('tests menu bar mounting', async() => {
    await renderSuspended(AssayMenuBar, defaultRenderOptions);
    [
      GROUP_LABEL_TEXT,
      BY_LABEL_TEXT,
      PAGINATION_LABEL_TEXT,
      GENERATE_BTN_TEXT,
    ].forEach((label) => {
      expect(within(screen.getByTestId('assayMenuBar')).getByLabelText(label)).toBeTruthy();
    });
  });

  it('tests pagination', async() => {
    await renderSuspended(AssayMenuBar, defaultRenderOptions);
    await waitFor(() => expect(screen.getByRole('switch')).toBeChecked());
    await fireEvent.click(screen.getByRole('switch'));
    await waitFor(() => expect(screen.getByRole('switch')).not.toBeChecked());
  });

  it('tests group select dropdown', async() => {
    await renderSuspended(AssayMenuBar, defaultRenderOptions);
    const groupSelectDropdown = screen.getByRole('combobox', {name: GROUP_LABEL_TEXT});
    await fireEvent.click(groupSelectDropdown);
    radialMockResponseForBpaAndTenNeighbors.report_db.forEach((item) => {
      expect(screen.getByLabelText(item.name)).toBeTruthy();
    });

    const selectedOption = screen.getByRole('option', {name: radialMockResponseForBpaAndTenNeighbors.report_db[0]?.name});
    if (selectedOption) {
      await fireEvent.click(selectedOption);
      await fireEvent.click(groupSelectDropdown);
    }
    const firstAvailableOption = screen.getByRole('option', {name: radialMockResponseForBpaAndTenNeighbors.report_db[1]?.name});
    if (firstAvailableOption) { await fireEvent.click(firstAvailableOption); }
  });

  it('tests by select dropdown', async() => {
    await renderSuspended(AssayMenuBar, defaultRenderOptions);
    const bySelectDropdown = screen.getByRole('combobox', {name: BY_LABEL_TEXT});
    await fireEvent.click(bySelectDropdown);

    const subFields = radialMockResponseForBpaAndTenNeighbors.report_db
      .find(item => item.key === GENRA_DEFAULT_PARAMS.summarise)?.subFields;

    if (subFields) {
      subFields.forEach((subField) => {
        expect(screen.getByLabelText(subField.name)).toBeTruthy();
      });
    }

    const selectedOption = screen.getByRole('option', {name: subFields?.[0]?.name});
    if (selectedOption) {
      await fireEvent.click(selectedOption);
      await fireEvent.click(bySelectDropdown);
    }
    const firstAvailableOption = screen.getByRole('option', {name: subFields?.[1]?.name});
    if (firstAvailableOption) { await fireEvent.click(firstAvailableOption); }
  });

  it('tests edge cases', async() => {
    await renderSuspended(AssayMenuBar, {
      ...defaultRenderOptions,
      props: {
        ...defaultRenderOptions.props,
        summarise: 'test-false-find',
        sumrsBy: 'test-false-find',
      },
    });
  });
});
