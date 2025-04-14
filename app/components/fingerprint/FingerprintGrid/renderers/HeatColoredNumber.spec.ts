import {describe, it} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import type {Column, ICellRendererParams} from 'ag-grid-community';
import HeatColoredNumber from './HeatColoredNumber.vue';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';
import type {FingerprintData} from '~/api/types';

describe('Heater Colored Number FP Renderer', () => {
  it('mounts renderer', async() => {
    await renderSuspended(HeatColoredNumber, {
      props: {
        params: {
          value: 5,
          column: {
            getColId: () => 'chm_mrgn',
          },
          data: fingerprintMockResponseForBpaAndTenNeighbors.data[0],
        } as unknown as ICellRendererParams<FingerprintData>,
      },
    });
  });

  it('tests edge cases', async() => {
    const newData = fingerprintMockResponseForBpaAndTenNeighbors.data[0];
    newData!.chm_mrgn = {
      value: 21,
      scaled: 0.2,
    };
    await renderSuspended(HeatColoredNumber, {
      props: {
        params: {
          value: null,
          column: {
            getColId: () => 'chm_mrgn',
          } as unknown as Column,
          data: newData,
        } as unknown as ICellRendererParams<FingerprintData>,
      },
    });
  });
});
