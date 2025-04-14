import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
  vi,
} from 'vitest';
import {PrimeVue} from '@primevue/core';
import {createTestingPinia} from '@pinia/testing';
import {
  fireEvent, screen, waitFor,
} from '@testing-library/vue';
import TypeAheadSearch from './TypeAheadSearch.vue';
import {TYPEAHEAD_SEARCH_PLACEHOLDER_TXT} from './config';
import {mockAllGenRAEndpointsWithBpaAndTenNeighbors, mockGenraEndpoint} from '~/test/vitest/helpers';
import {searchMockResponseForBPA} from '~/test/vitest/mockData/api/ChemicalSearchMocks';

const mockResponse = vi.fn();
mockGenraEndpoint('SEARCH', mockResponse, {handler: mockResponse});
mockAllGenRAEndpointsWithBpaAndTenNeighbors();
const textInput = () => screen.getByPlaceholderText(TYPEAHEAD_SEARCH_PLACEHOLDER_TXT);
describe('TypeAhead Search', () => {
  it('tests search results in dropdown', async() => {
    await renderSuspended(TypeAheadSearch, {
      global: {plugins: [createTestingPinia(), PrimeVue], stubs: {teleport: true}},
    });
    mockResponse.mockImplementation(() => ({...searchMockResponseForBPA}));
    expect(textInput()).toBeTruthy();

    await fireEvent.update(textInput(), 'BPA');
    if (searchMockResponseForBPA.hits[0]?.name) {
      await waitFor(() => expect(screen.getByText(searchMockResponseForBPA.hits[0]!.name)).toBeTruthy());
    }

    searchMockResponseForBPA.hits.forEach((response) => {
      expect(response.name).toBeTruthy();
    });
  });

  it('tests empty message displayed', async() => {
    await renderSuspended(TypeAheadSearch, {
      global: {plugins: [createTestingPinia(), PrimeVue], stubs: {teleport: true}},
    });

    mockResponse.mockImplementation(() => ({hits: []}));
    await fireEvent.update(textInput(), 'BPAADASDASDAD');
    await waitFor(() => expect(screen.getByText('No results found. Please try again.')).toBeTruthy());
  });

  it('tests selecting option', async() => {
    await renderSuspended(TypeAheadSearch, {
      global: {plugins: [
        createTestingPinia({
          initialState: {
            params: GENRA_DEFAULT_PARAMS,
          },
        }), PrimeVue,
      ],
      stubs: {teleport: true}},
    });
    mockResponse.mockImplementation(() => ({...searchMockResponseForBPA}));

    await fireEvent.update(textInput(), 'BPA');
    if (searchMockResponseForBPA.hits[0]?.name) {
      await waitFor(() => expect(screen.getByText(searchMockResponseForBPA.hits[0]!.name)).toBeTruthy());
    }

    await fireEvent.click(screen.getByText(searchMockResponseForBPA.hits[0]!.name));

    if (searchMockResponseForBPA.hits[0]!.dsstox_cid) {
      await waitFor(() => expect(screen.getByText(searchMockResponseForBPA.hits[0]!.dsstox_cid as string)).toBeTruthy());
    }
  });
});
