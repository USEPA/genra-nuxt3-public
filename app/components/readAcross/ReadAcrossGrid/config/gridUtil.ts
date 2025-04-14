import type {ICellRendererParams} from 'ag-grid-community';
import type {ReadAcrossItem} from '~/api/types';

export const cellRendererSelector = (params: ICellRendererParams<ReadAcrossItem>) => {
  const component = params.value?.cellRenderer;
  if (component) {
    return {component};
  }

  // eslint-disable-next-line no-undefined
  return undefined;
};
