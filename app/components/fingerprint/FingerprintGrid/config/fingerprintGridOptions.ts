import type {
  GridOptions,
} from 'ag-grid-community';
import {getColor} from './gridUtil';
import type {FingerprintData} from '~/api/types';
import baseGridOptions from '~/components/shared/baseGridOptions';

export const fpGridOptions: GridOptions<FingerprintData> = {
  ...baseGridOptions,
  defaultColDef: {
    filter: 'agTextColumnFilter',
    cellStyle: getColor,
    sortable: true,
    resizable: true,
  },
};
