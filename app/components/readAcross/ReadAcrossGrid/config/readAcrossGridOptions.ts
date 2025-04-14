import type {
  GridOptions,
  IRowNode,
} from 'ag-grid-community';
import type {ReadAcrossItem} from '~/api/types';
import baseGridOptions from '~/components/shared/baseGridOptions';

// eslint-disable-next-line no-unused-vars
const {onGridReady, ...restBaseGridOptions} = baseGridOptions;

export const readAcrossGridOptions: GridOptions<ReadAcrossItem> = {
  ...restBaseGridOptions,
  valueCache: true,
  headerHeight: 150,
  suppressContextMenu: true,
  suppressMakeColumnVisibleAfterUnGroup: true,
  groupAllowUnbalanced: true,
  floatingFiltersHeight: 45,
  defaultColDef: {
    filter: 'agTextColumnFilter',
    minWidth: 65,
    sortable: true,
    resizable: true,
    headerComponent: 'ReadAcrossCustomHeader',
    equals: (oldCol, newCol) => {
      if (oldCol && newCol) {
        const checkedEquals = oldCol.isChecked === newCol.isChecked;
        const predictionEquals = oldCol.isPrediction === newCol.isPrediction;
        const similarityEquals = oldCol.similarity === newCol.similarity;
        const useWidthEquals = oldCol.useWidth === newCol.useWidth;
        const valueEquals = oldCol.value === newCol.value;
        return checkedEquals && predictionEquals && similarityEquals && useWidthEquals && valueEquals;
      }
      return true;
    },
  },
  postSortRows: ({nodes: rowNodes}) => {
    let nextInsertPos = 0;
    for (let i = 0; i < rowNodes.length; i += 1) {
      const currentRow = rowNodes[i];
      if (currentRow?.group) {
        const sortedRowChildren = currentRow?.allLeafChildren?.sort((a, b) => {
          if (a.data && b.data) {
            if (a.data?.ep_name > b.data?.ep_name) {
              return 1;
            }
            if (b.data.ep_name > a.data.ep_name) {
              return -1;
            }
          }
          return 0;
        });
        currentRow.childrenAfterSort = sortedRowChildren ?? null;
        rowNodes.splice(nextInsertPos, 0, rowNodes.splice(i, 1)[0] as IRowNode<ReadAcrossItem>);
        nextInsertPos += 1;
      }
    }
  },
};
