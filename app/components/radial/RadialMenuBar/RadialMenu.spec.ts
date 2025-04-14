import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, it, expect,
  vi,
  afterEach,
  beforeEach,
} from 'vitest';
import {createTestingPinia} from '@pinia/testing';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen, waitFor,
} from '@testing-library/vue';
import RadialMenuBar from './RadialMenuBar.vue';
import {
  NEIGHBORS_BY_LABEL_TEXT, FILTER_BY_LABEL_TEXT, DOWNLOAD_LABEL_TEXT,
  HYBRID_FP_LABEL_TEXT,
} from './constants';
import {basicRequestParamsForBpaAndTenNeighbor} from '~/test/vitest/mockData/api/ParamsMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {itif, mockGenraEndpoint} from '~/test/vitest/helpers';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';

const defaultProps = {
  params: basicRequestParamsForBpaAndTenNeighbor,
  setupResponse: setupMockResponseForBpa,
  neighborByOptions: setupMockResponseForBpa.neighbor_by,
  filterByOptions: setupMockResponseForBpa.filter_by,
};
const mockSetupResponse = vi.fn();
mockSetupResponse.mockImplementation(() => setupMockResponseForBpa);
mockGenraEndpoint('SETUP', mockSetupResponse, {handler: mockSetupResponse});
mockGenraEndpoint('PHYSCHEM_PLOT', 'test');
mockGenraEndpoint('RADIAL', radialMockResponseForBpaAndTenNeighbors);

const downloadResponse = vi.fn();
const firstItemDownload = setupMockResponseForBpa.download.filter(({rel}) => rel.includes('radial'))[0];
mockGenraEndpoint('DOWNLOAD', new Blob(), {
  method: 'POST',
  appendEndpoint: firstItemDownload?.subdir ?? 'RAview',
});

const defaultGlobal = {
  plugins: [
    createTestingPinia({
      initialState: {
        appBaseStore: {
          params: GENRA_DEFAULT_PARAMS,
          setupResponse: setupMockResponseForBpa,
        },
      },
    }), PrimeVue,
  ],
  stubs: {
    teleport: true,
  },
};

describe('Radial Menu', () => {
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(),
    revokeObjectURL: vi.fn(),
  });
  beforeEach(() => {
    vi.useFakeTimers({shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('tests menu mounts', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    [NEIGHBORS_BY_LABEL_TEXT, FILTER_BY_LABEL_TEXT, DOWNLOAD_LABEL_TEXT].forEach((label) => {
      expect(screen.findByText(label)).toBeTruthy();
    });
  });

  it('tests neighbor by', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    const neighborBySelectBox = screen.getByRole('combobox', {name: NEIGHBORS_BY_LABEL_TEXT});
    await fireEvent.click(neighborBySelectBox);
    setupMockResponseForBpa.neighbor_by.forEach((neighbor) => {
      expect(screen.findByText(neighbor.name)).toBeTruthy();
    });

    if (setupMockResponseForBpa.neighbor_by[1]) {
      await fireEvent.click(screen.getByText(setupMockResponseForBpa.neighbor_by[1].name));
      await waitFor(() => expect(screen.getByText(setupMockResponseForBpa.neighbor_by[1]!.name)).toBeTruthy());
    }
  });

  itif(defaultProps.neighborByOptions.some(({key}) => key === 'hybrid'))('tests hybrid fp popover mounts', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });
    const neighborBySelectBox = screen.getByRole('combobox', {name: NEIGHBORS_BY_LABEL_TEXT});
    await fireEvent.click(neighborBySelectBox);

    const hybridFpSelection = setupMockResponseForBpa.neighbor_by.find(({key}) => key === 'hybrid');
    await fireEvent.click(screen.getByText(hybridFpSelection!.name));
    await waitFor(() => expect(screen.getByText(HYBRID_FP_LABEL_TEXT)).toBeTruthy());
    const closeBtn = screen.getByRole('button', {name: 'Close'});
    await fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.queryByText(HYBRID_FP_LABEL_TEXT)).toBeFalsy());
  });

  it('tests edit label for already selected custom', async() => {
    mockSetupResponse.mockImplementationOnce(() => ({
      ...setupMockResponseForBpa,
      neighbor_by: setupMockResponseForBpa.neighbor_by.filter(({key}) => key === 'hybrid'),
    }));
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
        neighborByOptions: setupMockResponseForBpa.neighbor_by.filter(({key}) => key === 'hybrid'),
        params: {
          ...defaultProps.params,
          fp_weight: '1,3',

        },
      },
      global: defaultGlobal,
    });
    const neighborBySelectBox = screen.getByRole('combobox', {name: NEIGHBORS_BY_LABEL_TEXT});
    await fireEvent.click(neighborBySelectBox);
    expect(screen.getByText('Edit Custom hybrid (can be slow)')).toBeTruthy();
  });

  it('tests filter by', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    const filterBySelectBox = screen.getByRole('combobox', {name: FILTER_BY_LABEL_TEXT});
    await fireEvent.click(filterBySelectBox);
    setupMockResponseForBpa.filter_by.forEach((filterBy) => {
      expect(screen.getByRole('option', {name: filterBy.name})).toBeTruthy();
    });

    if (setupMockResponseForBpa.filter_by[1]) {
      await fireEvent.click(screen.getByText(setupMockResponseForBpa.filter_by[1].name));
      await waitFor(() => expect(screen.getByText(setupMockResponseForBpa.filter_by[1]!.name,
        {exact: false})).toBeTruthy());
    }
  });

  it('tests download', async() => {
    downloadResponse.mockImplementation(() => new Blob());
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    const downloadSelectBox = screen.getByRole('combobox', {name: DOWNLOAD_LABEL_TEXT});
    await fireEvent.click(downloadSelectBox);
    setupMockResponseForBpa.download.filter(({rel}) => rel.includes('radial')).forEach((file) => {
      expect(screen.getByRole('option', {name: file.name})).toBeTruthy();
    });

    if (firstItemDownload) {
      await fireEvent.click(screen.getByText(firstItemDownload.name));
    }
  });
});
