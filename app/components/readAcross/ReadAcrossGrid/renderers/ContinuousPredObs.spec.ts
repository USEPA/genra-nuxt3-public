import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe,
  it, beforeEach, afterEach, vi,
  expect,
} from 'vitest';
import type {ICellRendererParams} from 'ag-grid-community';
import {screen} from '@testing-library/vue';
import ContinuousPredObs from './ContinuousPredObs.vue';
import {getReadAcrossWithContinuousDataMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/ReadAcrossMocks';
import type {ReadAcrossItem} from '~/api/types';

describe('Continuous Pred/Obs renderer', () => {
  beforeEach(() => {
    vi.useFakeTimers({shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('mounts svg', async() => {
    await renderSuspended(ContinuousPredObs, {
      props: {
        params: {
          ...getReadAcrossWithContinuousDataMockResponseForBpaAndTenNeighbors
            .data[2],
          colDef: {
            field: 'DTXCID501124',
          },
        } as unknown as ICellRendererParams<ReadAcrossItem>,
      },
    });
    expect(screen.getByTestId('raContinuousSvg')).toBeTruthy();
  });

  it('mounts svg with estimate', async() => {
    await renderSuspended(ContinuousPredObs, {
      props: {
        params: {
          ...getReadAcrossWithContinuousDataMockResponseForBpaAndTenNeighbors
            .data[9],
          colDef: {
            field: 'DTXCID501124',
          },
          data: {
            ep_name: 'Phenol',
          },
          value: {
            cellRenderer: 'ContinuousPredObs',
            isChecked: true,
            isPrediction: false,
            similarity: 0.26,
            useWidth: false,
            value: 'pos_effect',
            continuousData: true,
            rangeMin: -0.7023299936781117,
            rangeMax: 0.9014116459334918,
            confMin: null,
            confMax: null,
            estimate: 3,
            observation: 0.12326039554984815,
            obs_disp: '125',
            dir: 'RL',
          },
        } as unknown as ICellRendererParams<ReadAcrossItem>,

      },
    });
    expect(screen.getByTestId('raContinuousSvg')).toBeTruthy();
    expect(screen.getByTestId('raContinuousSvgEstimate')).toBeTruthy();
  });

  it('mounts svg with estimate and conf lines', async() => {
    await renderSuspended(ContinuousPredObs, {
      props: {
        params: {
          ...getReadAcrossWithContinuousDataMockResponseForBpaAndTenNeighbors
            .data[9],
          colDef: {
            field: 'DTXCID501124',
          },
          data: {
            ep_name: 'Phenol',
          },
          value: {
            cellRenderer: 'ContinuousPredObs',
            isChecked: true,
            isPrediction: false,
            similarity: 0.26,
            useWidth: false,
            value: 'pos_effect',
            continuousData: true,
            rangeMin: -0.7023299936781117,
            rangeMax: 0.9014116459334918,
            confMin: -1,
            confMax: 4,
            estimate: 2,
            esp_disp: '303',
            observation: 0.12326039554984815,
            obs_disp: '125',
            dir: 'RL',
          },
        } as unknown as ICellRendererParams<ReadAcrossItem>,
      },
    });
    expect(screen.getByTestId('raContinuousTLine')).toBeTruthy();
  });
});
