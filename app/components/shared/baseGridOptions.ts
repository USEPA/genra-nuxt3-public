import type {
  GridOptions, GridReadyEvent, GridSizeChangedEvent,
} from 'ag-grid-community';

const baseGridOptions: GridOptions = {
  rowSelection: 'multiple',
  headerHeight: 90,
  suppressContextMenu: true,
  suppressMenuHide: true,
  enableCellTextSelection: true,
  tooltipShowDelay: 0,
  onGridReady: (params: GridReadyEvent) => {
    resizeGrid(params.api);
  },
  onGridSizeChanged: (params: GridSizeChangedEvent) => {
    resizeGrid(params.api);
  },
  statusBar: {
    statusPanels: [
      {
        statusPanel: 'agTotalAndFilteredRowCountComponent',
        align: 'left',
      },
      {
        statusPanel: 'agTotalRowCountComponent',
        align: 'center',
      },
      {statusPanel: 'agFilteredRowCountComponent'},
      {statusPanel: 'agSelectedRowCountComponent'},
      {statusPanel: 'agAggregationComponent'},
    ],
  },
};

export default baseGridOptions;
