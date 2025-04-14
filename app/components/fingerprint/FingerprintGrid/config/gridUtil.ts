import type {
  CellClassParams, ColDef, ValueGetterParams,
} from 'ag-grid-community';
import type {FingerprintData, FingerprintBaseItem} from '~/api/types';

export const colormaps = {
  inferno: [
    '#000004', '#03010c', '#070313', '#0a041b', '#0e0522', '#11072a', '#150831', '#180939', '#1c0b40',
    '#1f0c48', '#250c4c', '#2b0d50', '#310d54', '#370d58', '#3d0e5d', '#430e61', '#490e65', '#4f0f69',
    '#550f6d', '#5b116d', '#60136c', '#66156c', '#6c176c', '#711a6b', '#771c6b', '#7d1e6b', '#82206a',
    '#88226a', '#8e2468', '#932665', '#992963', '#9e2b61', '#a42d5e', '#a92f5c', '#af325a', '#b43457',
    '#ba3655', '#bf3a51', '#c33e4d', '#c8424a', '#cc4646', '#d14942', '#d54d3e', '#da513b', '#de5537',
    '#e35933', '#e65f2e', '#e96629', '#eb6c24', '#ee731f', '#f17919', '#f47f14', '#f6860f', '#f98c0a',
    '#f9930e', '#f99a13', '#f9a017', '#f9a71c', '#f9ae20', '#f9b525', '#f9bb29', '#f9c22e', '#f9c932',
    '#f9cf3f', '#fad54b', '#fadb58', '#fae165', '#fbe771', '#fbed7e', '#fbf38b', '#fcf997', '#fcffa4',
  ],
};

export const getCellColorFromInfernoMap = (value: number) => colormaps
  ?.inferno?.[parseInt((72 * (1 - value)).toString(), 10)] as string ?? '';

export const getColor = (params: CellClassParams<FingerprintData>) => {
  const column = params.column.getColId() as keyof FingerprintData;
  const scaled = params.data?.[column] as FingerprintBaseItem;
  return {
    backgroundColor: getCellColorFromInfernoMap(scaled.scaled),
  };
};

export const getHeatVal = (params: ValueGetterParams<FingerprintData>) => {
  const column = (params.column as ColDef).colId as keyof FingerprintData;
  const value = params.data?.[column] as FingerprintBaseItem;
  return value.value;
};
