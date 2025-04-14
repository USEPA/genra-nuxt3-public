import {
  afterEach,
  beforeEach,
  describe, expect, it,
  vi,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {createTestingPinia} from '@pinia/testing';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen,
  within,
} from '@testing-library/vue';
import {DOWNLOAD_LABEL_TEXT} from '../radial/RadialMenuBar/constants';
import ReadAcrossPanel from './ReadAcrossPanel.vue';
import {
  RUN_READ_ACROSS_BTN_TEXT, ENGINE_LABEL_TEXT, SORT_LABEL_TEXT,
  MIN_POS_OBSERVATION_LABEL_TEXT, MIN_NEG_OBSERVATION_LABEL_TEXT, SIMILARITY_LABEL_TEXT,
} from './ReadAcrossMenuBar/constants';
import {getReadAcrossMockResponseForBpaAndTenNeighbors, runReadAcrossMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/ReadAcrossMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {mockGenraEndpoint} from '~/test/vitest/helpers';

const defaultReadAcrossPanelInitialState = {
  appBaseStore: {
    params: GENRA_DEFAULT_PARAMS,
    setupResponse: setupMockResponseForBpa,
    currentStep: 3,
  },
  readAcrossStore: {
    readAcrossResponse: getReadAcrossMockResponseForBpaAndTenNeighbors,
    runReadAcrossResponse: runReadAcrossMockResponseForBpaAndTenNeighbors,
    isReadAcrossLoading: false,
    showSelectionChangeDialog: false,
  },
  radialStore: {
    isRadialPanelLoading: false,
  },
  fingerprintStore: {
    isFingerprintLoading: false,
  },
  assayStore: {
    isAssayLoading: false,
  },
};

const defaultRenderOptions = {
  global: {
    plugins: [
      createTestingPinia({
        initialState: defaultReadAcrossPanelInitialState,
      }),
      PrimeVue,
    ],
    stubs: {
      teleport: true,
    },
  },
};

const expectAllPanelLabelsToExist = () => {
  [
    RUN_READ_ACROSS_BTN_TEXT,
    ENGINE_LABEL_TEXT,
    SORT_LABEL_TEXT,
    MIN_POS_OBSERVATION_LABEL_TEXT,
    MIN_NEG_OBSERVATION_LABEL_TEXT,
    SIMILARITY_LABEL_TEXT,
  ].forEach((label) => {
    expect(screen.getByText(label)).toBeTruthy();
  });
};

const rraResponse = vi.fn();
mockGenraEndpoint('GET_READACROSS', getReadAcrossMockResponseForBpaAndTenNeighbors);

mockGenraEndpoint('RUN_READACROSS', runReadAcrossMockResponseForBpaAndTenNeighbors, {
  method: 'POST',
  handler: rraResponse,
});

const downloadOption = setupMockResponseForBpa.download.filter(({rel, subdir}) => !!subdir &&
  (!rel || rel.includes('readacross'))).find(option => option.data_exists);
const downloadResponse = vi.fn();
mockGenraEndpoint('DOWNLOAD', new Blob(), {
  method: 'POST',
  appendEndpoint: downloadOption?.subdir as string,
  handler: downloadResponse,
});

describe('Read Across Panel', () => {
  beforeEach(() => {
    vi.useFakeTimers({shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('tests mounting Read Across panel', async() => {
    await renderSuspended(ReadAcrossPanel, defaultRenderOptions);
    expectAllPanelLabelsToExist();
  });

  it('tests form change', async() => {
    rraResponse.mockImplementation(() => runReadAcrossMockResponseForBpaAndTenNeighbors);
    await renderSuspended(ReadAcrossPanel, defaultRenderOptions);
    const textInput = screen.getByLabelText('Assay endpoint Filter Input');
    await fireEvent.update(textInput, 'adre');

    const simWidthSwitch = screen.getByRole('switch', {name: SIMILARITY_LABEL_TEXT});
    await fireEvent.click(simWidthSwitch);
    const runRraBtn = screen.getByLabelText(RUN_READ_ACROSS_BTN_TEXT);
    await fireEvent.click(runRraBtn);

    expect(screen.getByRole('treegrid')).toBeTruthy();
    expectAllPanelLabelsToExist();
  });

  it('tests panel in rra state', async() => {
    await renderSuspended(ReadAcrossPanel, {
      ...defaultRenderOptions,
      global: {
        ...defaultRenderOptions.global,
        plugins: [
          PrimeVue, createTestingPinia({
            initialState: {
              ...defaultReadAcrossPanelInitialState,
              appBaseStore: {
                ...defaultReadAcrossPanelInitialState.appBaseStore,
                currentStep: 4,
              },
            },
          }),
        ],
      },
    });
    expect(screen.getByRole('treegrid')).toBeTruthy();
    expectAllPanelLabelsToExist();

    const minPlusSelect = screen.getByRole('combobox', {name: MIN_POS_OBSERVATION_LABEL_TEXT});
    await fireEvent.click(minPlusSelect);
    const option = screen.getByRole('option', {name: '5'});
    await fireEvent.click(option);

    // RA selection dialog
    expect(screen.getByTestId('readAcrossSelectionDialog')).toBeTruthy();
    await fireEvent.click(within(screen.getByTestId('readAcrossSelectionDialog')).getByRole('button', {name: 'Reset'}));
    expect(screen.queryByTestId('readAcrossSelectionDialog')).toBeFalsy();
  });

  it('tests engine changing', async() => {
    rraResponse.mockImplementation(() => runReadAcrossMockResponseForBpaAndTenNeighbors);
    await renderSuspended(ReadAcrossPanel, {
      ...defaultRenderOptions,
      global: {
        ...defaultRenderOptions.global,
        plugins: [
          PrimeVue, createTestingPinia({
            initialState: {
              ...defaultReadAcrossPanelInitialState,
              appBaseStore: {
                ...defaultReadAcrossPanelInitialState.appBaseStore,
                currentStep: 4,
              },
            },
          }),
        ],
      },
    });

    const minPlusSelect = screen.getByRole('combobox', {name: MIN_POS_OBSERVATION_LABEL_TEXT});
    await fireEvent.click(minPlusSelect);
    const minOption = screen.getByRole('option', {name: '5'});
    await fireEvent.click(minOption);

    await fireEvent.click(within(screen.getByTestId('readAcrossSelectionDialog')).getByRole('button', {name: 'Close'}));
    expect(screen.queryByTestId('readAcrossSelectionDialog')).toBeFalsy();
  });

  it('tests download', async() => {
    downloadResponse.mockImplementation(() => new Blob());
    await renderSuspended(ReadAcrossPanel, defaultRenderOptions);

    const downloadSelect = screen.getByRole('combobox', {name: DOWNLOAD_LABEL_TEXT});
    await fireEvent.click(downloadSelect);

    if (downloadOption) {
      await fireEvent.click(screen.getByRole('option', {name: downloadOption.name}));
    }
    expect(screen.getByRole('combobox', {name: DOWNLOAD_LABEL_TEXT})).toBeTruthy();
  });
});
