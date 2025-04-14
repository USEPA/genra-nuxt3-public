import {renderSuspended} from '@nuxt/test-utils/runtime';
import {describe, it} from 'vitest';
import type {ICellRendererParams} from 'ag-grid-community';
import GenraChemicalLink from './GenraChemicalLink.vue';
import type {FingerprintData} from '~/api/types';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';

describe('Genra Chemical Link FP Renderer', () => {
  it('mounts the renderer', async() => {
    await renderSuspended(GenraChemicalLink, {
      props: {
        params: {
          value: 5,
          column: {
            getColId: () => 'chm_mrgn',
          },
          data: fingerprintMockResponseForBpaAndTenNeighbors.data[0],
          useField: 'chm_mrgn',
        } as unknown as ICellRendererParams<FingerprintData> & {
          useField: keyof FingerprintData;
        },
      },
    });
  });

  it('tests the renderer without a field', async() => {
    await renderSuspended(GenraChemicalLink, {
      props: {
        params: {
          value: 5,
          column: {
            getColId: () => 'chm_mrgn',
          },
          data: fingerprintMockResponseForBpaAndTenNeighbors.data[0],
        } as unknown as ICellRendererParams<FingerprintData> & {
          useField: keyof FingerprintData;
        },
      },
    });
  });
});
