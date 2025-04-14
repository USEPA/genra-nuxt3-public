import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';
import {screen} from '@testing-library/vue';
import AssayGrid from './AssayGrid.vue';
import {assayMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/AssayMocks';

describe('Assay Grid', () => {
  beforeEach(() => {
    vi.useFakeTimers({shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('tests grid mounting', async() => {
    await renderSuspended(AssayGrid, {
      props: {
        assayResponse: assayMockResponseForBpaAndTenNeighbors,
        paginate: true,
      },
    });
    assayMockResponseForBpaAndTenNeighbors.columns.forEach((column) => {
      expect(screen.getByText(column.headerName as string)).toBeTruthy();
    });
  });

  it('tests grid mounting', async() => {
    await renderSuspended(AssayGrid, {
      props: {
        assayResponse: {
          ...assayMockResponseForBpaAndTenNeighbors,
          // @ts-expect-error
          columns: null,
          // @ts-expect-error
          data: null,
        },
        paginate: true,
      },
    });
    assayMockResponseForBpaAndTenNeighbors.columns.forEach((column) => {
      expect(screen.queryByText(column.headerName as string)).toBeFalsy();
    });
  });
});
