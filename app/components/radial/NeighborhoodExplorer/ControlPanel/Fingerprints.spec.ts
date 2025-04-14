import {
  describe, expect, it,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen, waitFor,
} from '@testing-library/vue';
import Fingerprints from './Fingerprints.vue';
import {GRAPH_TYPE_SELECT_LABEL_TEXT, FILTER_BY_SELECT_LABEL_TEXT} from './constants';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';

const fps = setupMockResponseForBpa.neighbor_by.filter(({key}) => key !== 'hybrid');

const defaultRenderOptions = {
  props: {
    setupResponse: setupMockResponseForBpa,
    updatedGraphParams: {
      filterBy: setupMockResponseForBpa.filter_by[0]?.key ?? '',
      graphType: setupMockResponseForBpa.graph_type[0]?.key ?? '',
      fingerprints: setupMockResponseForBpa.initGraphFPs,
    },
  },
  global: {
    plugins: [PrimeVue],
  },
};

describe('Fingerprint switches', () => {
  it('tests default fingerprints are selected', async() => {
    await renderSuspended(Fingerprints, defaultRenderOptions);
    fps.forEach(({name, key}) => {
      expect(screen.getByText(name)).toBeTruthy();
      if (setupMockResponseForBpa.initGraphFPs.includes(key)) {
        expect(screen.getByLabelText(name)).toBeChecked();
      }
    });
  });

  it('tests selection', async() => {
    await renderSuspended(Fingerprints, defaultRenderOptions);
    const firstUnselectedSwitch = fps.findIndex(({key}) => !setupMockResponseForBpa.initGraphFPs.includes(key));
    if (firstUnselectedSwitch) {
      await fireEvent.click(screen.getAllByRole('switch')[firstUnselectedSwitch] as HTMLElement);
      await waitFor(() => expect(screen.getAllByRole('switch')[firstUnselectedSwitch]).toBeChecked());
    }
  });

  it('tests graph type', async() => {
    await renderSuspended(Fingerprints, defaultRenderOptions);
    const graphTypeSelect = screen.getByRole('combobox', {name: GRAPH_TYPE_SELECT_LABEL_TEXT});

    await fireEvent.click(graphTypeSelect);

    setupMockResponseForBpa.graph_type.forEach(({name}) => {
      expect(screen.getByRole('option', {name})).toBeTruthy();
    });
    await fireEvent.click(screen.getByRole('option', {name: setupMockResponseForBpa.graph_type[0]?.name}));
    expect(screen.getByRole('option', {name: setupMockResponseForBpa.graph_type[0]?.name}).ariaSelected).toBe('true');
  });

  it('tests filter by', async() => {
    await renderSuspended(Fingerprints, defaultRenderOptions);
    const filterBySelect = screen.getByRole('combobox', {name: FILTER_BY_SELECT_LABEL_TEXT});
    await fireEvent.click(filterBySelect);

    const filterByNames = setupMockResponseForBpa.filter_by.map(({name}) => name);

    filterByNames.forEach((name) => {
      expect(screen.getByRole('option', {name})).toBeTruthy();
    });

    const firstUnselectedFilterByOption = async() => (await screen.findAllByRole('option')).find((option) => {
      return option.ariaLabel &&
        filterByNames.includes(option.ariaLabel) &&
        option.ariaSelected === 'false';
    }) as HTMLElement;
    const unselectedOptionBeforeClick = await firstUnselectedFilterByOption();
    if (unselectedOptionBeforeClick) {
      expect(unselectedOptionBeforeClick.ariaSelected).toBe('false');
      await fireEvent.click(unselectedOptionBeforeClick);
      expect(unselectedOptionBeforeClick.ariaSelected).toBe('true');
    }
  });

  it('tests update', async() => {
    await renderSuspended(Fingerprints, defaultRenderOptions);
    const updateBtn = () => screen.getByRole('button', {name: 'Update'});
    expect(updateBtn()).toBeDisabled();

    const firstUnselectedSwitch = fps.findIndex(({key}) => !setupMockResponseForBpa.initGraphFPs.includes(key));
    if (firstUnselectedSwitch) {
      await fireEvent.click(updateBtn());
      await fireEvent.click(screen.getAllByRole('switch')[firstUnselectedSwitch] as HTMLElement);
      await waitFor(() => expect(updateBtn()).not.toBeDisabled());
      await fireEvent.click(updateBtn());
    }
  });
});
