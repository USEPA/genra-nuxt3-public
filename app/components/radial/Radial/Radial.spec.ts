import {
  describe, expect, it,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {screen} from '@testing-library/vue';
import Radial from './Radial.vue';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import type {RadialViewResponseItem} from '~/api/types';
import {itif} from '~/test/vitest/helpers';

const numOfAnalogues = 10;

describe('Radial', () => {
  it('tests Radial', async() => {
    await renderSuspended(Radial, {
      props: {
        chemicals: radialMockResponseForBpaAndTenNeighbors.result,
        numOfAnalogues,
      },
    });
    expect(screen.getAllByRole('link')).toHaveLength(numOfAnalogues);
  });

  it('tests missing similarity_tag', async() => {
    const mockChemicalWithoutSimTag = radialMockResponseForBpaAndTenNeighbors.result;
    mockChemicalWithoutSimTag.splice(1, 1, {
      ...radialMockResponseForBpaAndTenNeighbors.result[0] as RadialViewResponseItem,
      similarity_tag: '',
    });
    await renderSuspended(Radial, {
      props: {
        chemicals: mockChemicalWithoutSimTag,
        numOfAnalogues,
      },
    });
    expect(screen.getAllByRole('link')).toHaveLength(numOfAnalogues);
  });

  itif(radialMockResponseForBpaAndTenNeighbors.result.length >= 5)('tests 15 neighbors', async() => {
    const mockChemicalWithoutSimTag = radialMockResponseForBpaAndTenNeighbors.result;
    mockChemicalWithoutSimTag.push(...[
      mockChemicalWithoutSimTag[0] as RadialViewResponseItem,
      mockChemicalWithoutSimTag[1] as RadialViewResponseItem,
      mockChemicalWithoutSimTag[2] as RadialViewResponseItem,
      mockChemicalWithoutSimTag[3] as RadialViewResponseItem,
      mockChemicalWithoutSimTag[4] as RadialViewResponseItem,
    ]);
    const fifteenNeighbors = 15;
    await renderSuspended(Radial, {
      props: {
        chemicals: mockChemicalWithoutSimTag,
        numOfAnalogues: fifteenNeighbors,
      },
    });
    expect(screen.getAllByRole('link')).toHaveLength(fifteenNeighbors);
  });
});
