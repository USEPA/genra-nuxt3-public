import type {
  CellClassParams,
} from 'ag-grid-community';
import type {AssayDataItem} from '../../../../api/types';

export const getColor = (params: CellClassParams<AssayDataItem>) => {
  const column = params.column.getColId() as keyof AssayDataItem;
  const val = params.data?.[column];
  let retColor = {
    backgroundColor: 'black', borderRight: '.5px solid white', borderBottom: '.5px solid white',
  };
  if (!val) {
    retColor = {
      backgroundColor: 'lightgrey', borderRight: '.5px solid white', borderBottom: '.5px solid white',
    };
  }
  return retColor;
};
