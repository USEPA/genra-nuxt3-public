import {renderSuspended} from '@nuxt/test-utils/runtime';
import {describe, it} from 'vitest';
import FingerprintGrid from './FingerprintGrid.vue';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';
import type {FingerprintData} from '~/api/types';

describe('Fingerprint Grid', () => {
  it('mounts and unmounts', async() => {
    await renderSuspended(FingerprintGrid, {
      props: {
        fingerprintResponse: {
          ...fingerprintMockResponseForBpaAndTenNeighbors,
          data: fingerprintMockResponseForBpaAndTenNeighbors.data
            .concat(fingerprintMockResponseForBpaAndTenNeighbors.data[0] as FingerprintData),
        },
      },
    });
  });

  it('mounts and unmounts with less than 11 chems', async() => {
    await renderSuspended(FingerprintGrid, {
      props: {
        fingerprintResponse: {
          ...fingerprintMockResponseForBpaAndTenNeighbors,
          columns: [
            {
              ...fingerprintMockResponseForBpaAndTenNeighbors.columns[0],
            },
          ],
          data: [{...fingerprintMockResponseForBpaAndTenNeighbors.data[0] as FingerprintData}],
        },
      },
    });
  });
});
