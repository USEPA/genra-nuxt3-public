import type {
  GridOptions,
} from 'ag-grid-community';
import {getColor} from './gridUtil';
import type {AssayDataItem} from '~/api/types';
import baseGridOptions from '~/components/shared/baseGridOptions';

export const assayGridOptions: GridOptions<AssayDataItem> = {
  ...baseGridOptions,
  valueCache: true,
  floatingFiltersHeight: 45,
  pagination: true,
  defaultColDef: {
    filter: 'agTextColumnFilter',
    cellStyle: getColor,
    cellRenderer: () => '<div></div>',
    minWidth: 30,
    maxWidth: 90,
    sortable: true,
    resizable: true,
  },
};
