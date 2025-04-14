import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import type {ICellRendererParams} from 'ag-grid-community';
import {screen} from '@testing-library/vue';
import type {RedBlueTooltipParams} from '../types';
import RedBlueTooltip from './RedBlueTooltip.vue';
import {REDBLUE_NO_EFFECT, REDBLUE_NO_DATA} from './constants';
import {runReadAcrossMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/ReadAcrossMocks';
import type {ReadAcrossCellItem, ReadAcrossItem} from '~/api/types';

const defaultRedBlueProps = {
  params: {
    colDef: {
      field: 'DTXCID10465',
      headerComponentParams: {
        chem_id: 'DTXCID10465',
        isChecked: true,
        useWidth: false,
        name: 'Diethylstilbestrol',
        similarity: 0.29411765933036804,
        targetChem: false,
      },
    },

    data: runReadAcrossMockResponseForBpaAndTenNeighbors.data[1],
    value: {
      cellRenderer: 'RedBlueTooltip',
      isChecked: true,
      isPrediction: false,
      similarity: 0.29,
      useWidth: false,
      value: REDBLUE_NO_DATA,
    },
  } as unknown as ICellRendererParams<ReadAcrossItem> & RedBlueTooltipParams,
};

describe('RedBlue Cell Renderer', () => {
  it('tests mounting with no data', async() => {
    await renderSuspended(RedBlueTooltip, {
      props: {
        ...defaultRedBlueProps,
      },
    });

    expect(screen.getByTestId('redBlueToolTipWithoutWidth')).toHaveStyle('background-color: rgb(211, 211, 211)');
  });

  it('tests mounting target chem', async() => {
    const pval = 1;
    await renderSuspended(RedBlueTooltip, {
      props: {
        params: {
          colDef: {
            field: 'DTXCID10465',
            headerComponentParams: {
              chem_id: 'DTXCID10465',
              isChecked: true,
              useWidth: false,
              name: 'Diethylstilbestrol',
              similarity: 0.29411765933036804,
              targetChem: true,
            },
          },

          data: {
            ...runReadAcrossMockResponseForBpaAndTenNeighbors.data[1],
            DTXCID10465: {
              ...runReadAcrossMockResponseForBpaAndTenNeighbors?.data?.[1]?.DTXCID10465 as ReadAcrossCellItem,
              isChecked: true,
            },
          },
          value: {
            cellRenderer: 'RedBlueTooltip',
            isChecked: true,
            isPrediction: true,
            similarity: 0.29,
            useWidth: true,
            value: REDBLUE_NO_EFFECT,
            pval,
          },
        } as unknown as ICellRendererParams<ReadAcrossItem> & RedBlueTooltipParams,
      },
    });
    expect(screen.getByTestId('redBlueToolTipWithWidth')).toHaveStyle('background-color: rgb(70, 130, 180);');
    expect(screen.getByTestId('redBlueToolTipContainer')).toHaveStyle(`opacity: ${pval * 0.6 + 0.1}`);
  });

  it('tests mounting with prediction with value', async() => {
    await renderSuspended(RedBlueTooltip, {
      props: {
        params: {
          colDef: {
            ...defaultRedBlueProps.params.colDef,
            headerComponentParams: {
              chem_id: 'DTXCID10465',
              isChecked: true,
              useWidth: false,
              name: 'Diethylstilbestrol',
              similarity: 0.29411765933036804,
              targetChem: true,
            },
          },
          value: {
            ...defaultRedBlueProps.params.value,
            value: 3,
            isPrediction: true,
          },
          data: runReadAcrossMockResponseForBpaAndTenNeighbors.data[1],
        } as unknown as ICellRendererParams<ReadAcrossItem> & RedBlueTooltipParams,
      },
    });
    expect(screen.getByTestId('redBlueToolTipWithoutWidth')).toHaveStyle('background-color: rgb(139, 0, 0)');
  });

  it('tests mounting with prediction with value', async() => {
    await renderSuspended(RedBlueTooltip, {
      props: {
        params: {
          colDef: {
            ...defaultRedBlueProps.params.colDef,
          },
          value: {
            ...defaultRedBlueProps.params.value,
            value: 'dummyValue',
            isPrediction: false,
          },
          data: runReadAcrossMockResponseForBpaAndTenNeighbors.data[1],
        } as unknown as ICellRendererParams<ReadAcrossItem> & RedBlueTooltipParams,
      },
    });
    expect(screen.getByTestId('redBlueToolTipWithoutWidth')).toHaveStyle('background-color: rgb(139, 0, 0);');
  });
});
