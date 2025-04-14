import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen,
} from '@testing-library/vue';
import ReadAcrossSortBySelect from './ReadAcrossSortBySelect.vue';
import {SORT_LABEL_TEXT} from './constants';
import type {SortOrder} from './types';
import {getReadAcrossMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/ReadAcrossMocks';

const defaultSelectedSortOption = getReadAcrossMockResponseForBpaAndTenNeighbors.sortOptions?.[0];

const nonAlphaNameOption = getReadAcrossMockResponseForBpaAndTenNeighbors.sortOptions.find((option) => {
  return option.key !== 'alphaName';
});

const defaultRenderOptions = {
  props: {
    sortOptions: getReadAcrossMockResponseForBpaAndTenNeighbors.sortOptions,
    sortBy: defaultSelectedSortOption?.key,
    sortOrder: 'asc' as SortOrder,
  },
  global: {
    plugins: [PrimeVue],
  },
};

describe('RA Sort By', () => {
  it('tests mounting', async() => {
    await renderSuspended(ReadAcrossSortBySelect, defaultRenderOptions);

    expect(screen.getByText(SORT_LABEL_TEXT)).toBeTruthy();
  });

  it('tests changing sort by', async() => {
    await renderSuspended(ReadAcrossSortBySelect, defaultRenderOptions);
    const sortBySelectDropdown = screen.getByRole('combobox', {name: SORT_LABEL_TEXT});
    await fireEvent.click(sortBySelectDropdown);
    getReadAcrossMockResponseForBpaAndTenNeighbors.sortOptions.forEach((option) => {
      expect(screen.getByRole('option', {name: option.name})).toBeTruthy();
    });

    // Test selecting option that is already selected
    await fireEvent.click(screen.getByRole('option', {name: defaultSelectedSortOption?.name}));
    expect(screen.getByLabelText(defaultSelectedSortOption?.name ?? '')).toBeTruthy();
    await fireEvent.click(sortBySelectDropdown);

    // Test selecting first unselected option
    const firstAvailableOption = getReadAcrossMockResponseForBpaAndTenNeighbors.sortOptions.find((option) => {
      return option.key !== defaultSelectedSortOption?.key;
    })?.name;
    if (firstAvailableOption) {
      await fireEvent.click(screen.getByRole('option', {name: firstAvailableOption}));
      expect(screen.getByLabelText(firstAvailableOption)).toBeTruthy();
    }
  });

  it('tests changing sort order', async() => {
    await renderSuspended(ReadAcrossSortBySelect, {
      ...defaultRenderOptions,
      props: {
        ...defaultRenderOptions.props,
        sortOrder: 'desc',
      },

    });

    const sortOrderBtn = screen.getByRole('button');
    await fireEvent.click(sortOrderBtn);
    expect(screen.getByLabelText(`Click to toggle between ascending and descending ${defaultSelectedSortOption?.name}`)).toBeTruthy();
    await fireEvent.click(sortOrderBtn);
  });

  it('tests sort order icon', async() => {
    await renderSuspended(ReadAcrossSortBySelect, {
      ...defaultRenderOptions,
      props: {
        ...defaultRenderOptions.props,
        sortBy: nonAlphaNameOption?.key,
      },
    });
    const sortOrderBtn = screen.getByRole('button');
    await fireEvent.click(sortOrderBtn);
    expect(screen.getByLabelText(`Click to toggle between ascending and descending ${nonAlphaNameOption?.name}`)).toBeTruthy();
  });
});
