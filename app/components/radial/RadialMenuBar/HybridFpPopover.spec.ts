import {
  describe, expect,
  vi,
} from 'vitest';
import {createTestingPinia} from '@pinia/testing';
import {PrimeVue} from '@primevue/core';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  fireEvent, screen, waitFor,
  within,
} from '@testing-library/vue';

import RadialMenuBar from './RadialMenuBar.vue';
import {
  HYBRID_FP_ADD_FP_PLACEHOLDER_TEXT, HYBRID_FP_LABEL_TEXT, NEIGHBORS_BY_LABEL_TEXT,
} from './constants';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {basicRequestParamsForBpaAndTenNeighbor} from '~/test/vitest/mockData/api/ParamsMocks';
import {itif, mockGenraEndpoint} from '~/test/vitest/helpers';

const defaultProps = {
  params: basicRequestParamsForBpaAndTenNeighbor,
  setupResponse: setupMockResponseForBpa,
  neighborByOptions: setupMockResponseForBpa.neighbor_by,
  filterByOptions: setupMockResponseForBpa.filter_by,
};

const defaultPropsHasHybrid = defaultProps.neighborByOptions.some(({key}) => key === 'hybrid');
const neighborByHasAtLeastThree = defaultProps.neighborByOptions.filter(({key}) => key !== 'hybrid').length > 2;

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

const openCustomHybridPopover = async() => {
  const neighborBySelectBox = screen.getByRole('combobox', {name: NEIGHBORS_BY_LABEL_TEXT});
  await fireEvent.click(neighborBySelectBox);
  const hybridFpSelection = setupMockResponseForBpa.neighbor_by.find(({key}) => key === 'hybrid');
  await fireEvent.click(screen.getByText(hybridFpSelection!.name));
  await waitFor(() => expect(screen.getByText(HYBRID_FP_LABEL_TEXT)).toBeTruthy());
};

const addOptionSelect = (falsey: boolean = false) => falsey ?
  screen.queryByRole('combobox', {name: HYBRID_FP_ADD_FP_PLACEHOLDER_TEXT}) :
  screen.getByRole('combobox', {name: HYBRID_FP_ADD_FP_PLACEHOLDER_TEXT});

const firstSelection = () => within(screen.getByTestId('hybridFpPopover')).getByRole('option', {name: setupMockResponseForBpa.neighbor_by[0]!.name});
const secondSelection = () => within(screen.getByTestId('hybridFpPopover')).getByRole('option', {name: setupMockResponseForBpa.neighbor_by[1]!.name});
const thirdSelection = () => within(screen.getByTestId('hybridFpPopover')).getByRole('option', {name: setupMockResponseForBpa.neighbor_by[2]!.name});

const mockSetupResponse = vi.fn();
mockSetupResponse.mockImplementationOnce(() => setupMockResponseForBpa);
mockGenraEndpoint('SETUP', mockSetupResponse, {handler: mockSetupResponse});

describe('Hybrid FP Popover', () => {
  itif(defaultPropsHasHybrid)('tests neighbors are available', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    await openCustomHybridPopover();

    await fireEvent.click(addOptionSelect() as HTMLElement);
    setupMockResponseForBpa.neighbor_by.filter(({key}) => key !== 'hybrid').forEach((neighbor) => {
      expect(screen.findByText(neighbor.name)).toBeTruthy();
    });
  });

  itif(neighborByHasAtLeastThree)('tests max selections', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    await openCustomHybridPopover();
    await fireEvent.click(addOptionSelect() as HTMLElement);

    await fireEvent.click(firstSelection());
    expect(addOptionSelect()).toBeTruthy();
    await fireEvent.click(secondSelection());
    expect(addOptionSelect()).toBeTruthy();
    await fireEvent.click(thirdSelection());
    expect(addOptionSelect(true)).toBeFalsy();
  });

  itif(defaultPropsHasHybrid)('tests removing an option and disable option', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    await openCustomHybridPopover();
    await fireEvent.click(addOptionSelect() as HTMLElement);

    await fireEvent.click(firstSelection());

    await fireEvent.click(addOptionSelect() as HTMLElement);
    expect(firstSelection())
      .toHaveAttribute('aria-disabled', 'true');

    const firstRemoveBtn = within(screen.getByTestId('hybridFpPopover')).getByRole('button', {name: 'Remove'});
    await fireEvent.click(firstRemoveBtn);
  });

  itif(defaultPropsHasHybrid)('tests weight slider', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    await openCustomHybridPopover();
    await fireEvent.click(addOptionSelect() as HTMLElement);
    await fireEvent.click(firstSelection());
    expect(screen.getByText('Weight: 1')).toBeTruthy();
    const firstSlider = screen.getByRole('slider');
    await fireEvent.focus(firstSlider);
    await fireEvent.keyDown(firstSlider, {
      key: 'ArrowRight', code: 'ArrowRight', charCode: 39,
    });
    expect(screen.queryByText('Weight: 1')).toBeFalsy();
    expect(screen.getByText('Weight: 2')).toBeTruthy();
  });

  itif(defaultPropsHasHybrid)('tests changing existing selection', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    await openCustomHybridPopover();
    await fireEvent.click(addOptionSelect() as HTMLElement);
    await fireEvent.click(firstSelection());
    await fireEvent.click(addOptionSelect() as HTMLElement);
    await fireEvent.click(secondSelection());
    await fireEvent.click(addOptionSelect() as HTMLElement);
    await fireEvent.click(thirdSelection());
    await fireEvent.click(within(screen.getByTestId('hybridFpPopover')).getByRole('combobox', {name: setupMockResponseForBpa.neighbor_by[1]!.name}));
    await fireEvent.click(within(screen.getByTestId('hybridFpPopover')).getByRole('option', {name: setupMockResponseForBpa.neighbor_by[3]!.name}));
    await fireEvent.click(within(screen.getByTestId('hybridFpPopover')).getByRole('button', {name: 'Close'}));
  });

  itif(defaultPropsHasHybrid)('tests submit', async() => {
    await renderSuspended(RadialMenuBar, {
      props: {
        ...defaultProps,
      },
      global: defaultGlobal,
    });

    await openCustomHybridPopover();
    await fireEvent.click(addOptionSelect() as HTMLElement);
    await fireEvent.click(firstSelection());
    await fireEvent.click(within(screen.getByTestId('hybridFpPopover')).getByRole('combobox', {name: setupMockResponseForBpa.neighbor_by[0]!.name}));
    await fireEvent.click(within(screen.getByTestId('hybridFpPopover')).getByRole('button', {name: 'Submit'}));
  });
});
