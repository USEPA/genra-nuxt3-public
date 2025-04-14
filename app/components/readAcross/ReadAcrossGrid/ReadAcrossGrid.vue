<template>
  <div class="m-2 mt-1 h-full assay-grid">
    <ag-grid-vue
      id="readacrossgrid"
      ref="gridRef"
      class="ag-theme-balham w-full max-h-[98%]"
      :column-defs="gridColumns"
      :row-data="rowData"
      :auto-group-column-def="autoGroupColumnDef"
      :grid-options="gridOptions"
      :pagination="props.paginate"
      @filter-changed="onFilterChanged"
    />
  </div>
</template>

<script setup lang="ts">
import {AgGridVue} from 'ag-grid-vue3';
import type {
  GridApi, ApplyColumnStateParams, FilterChangedEvent, GridReadyEvent,
} from 'ag-grid-community';

import type {SortOrder} from '../ReadAcrossMenuBar/types';
import {cellRendererSelector} from './config/gridUtil';
import {readAcrossGridOptions} from './config/readAcrossGridOptions';
import ReadAcrossCustomHeader from './renderers/ReadAcrossCustomHeader.vue';
import RedBlueTooltip from './renderers/RedBlueTooltip.vue';
import PlainText from './renderers/PlainText.vue';
import ContinuousPredObs from './renderers/ContinuousPredObs.vue';
import type {ReadAcrossResponse, RunReadAcrossResponse} from '~/api/types';

const props = defineProps<{
  readAcrossResponse: ReadAcrossResponse | RunReadAcrossResponse | undefined;
  paginate: boolean;
  sortBy: string | undefined;
  sortOrder: SortOrder;
  simWeight: boolean;
}>();

const emits = defineEmits<{
  updateFilter: [filter: string];
}>();

const gridColumns = computed(() => {
  const newCols = structuredClone(toRaw(props.readAcrossResponse?.columns));
  return newCols ?
    newCols.map(column => ({
      ...column,
      ...(column.field !== 'ep_name' && {
        // eslint-disable-next-line no-undefined
        cellRenderer: undefined,
        cellRendererSelector,
      }),
    })) :
    [];
});

const gridOptions = computed(() => {
  return {
    ...readAcrossGridOptions,
    onGridReady,
  };
});

watch(() => gridColumns.value, (newVal, oldVal) => {
  if (newVal.length !== oldVal.length && gridApiRef.value) {
    setTimeout(() => {
      resizeGrid(gridApiRef.value);
    }, 200);
  }
});

const rowData = computed(() => props.readAcrossResponse?.data);

const gridApiRef = shallowRef<GridApi>();

const onGridReady = (params: GridReadyEvent) => {
  gridApiRef.value = params.api;

  resizeGrid(params.api);
};

const autoGroupColumnDef = computed(() => {
  const headerCol = gridColumns.value?.find(col => col.field === 'ep_name');
  if (headerCol) {
    const {
      // eslint-disable-next-line no-unused-vars
      hide, suppressColumnsToolPanel, ...restAutoGroupColumnDef
    } = headerCol;
    return restAutoGroupColumnDef;
  }
  return null;
});

const onFilterChanged = (event: FilterChangedEvent) => {
  const updatedFilterValue = event.api?.getFilterModel()?.['ag-Grid-AutoColumn']?.filter;
  emits('updateFilter', updatedFilterValue ?? '');
};

// Sorting
watch(() => [props.sortBy, props.sortOrder], () => {
  if (gridApiRef.value) {
    const columnState: ApplyColumnStateParams = {
      state: [
        {
          colId: props.sortBy as string,
          sort: props.sortOrder,
        },
      ],
      defaultState: {sort: null},
    };
    gridApiRef.value?.applyColumnState(columnState);
  }
});

defineExpose({
  ReadAcrossCustomHeader,
  RedBlueTooltip,
  PlainText,
  ContinuousPredObs,
});
</script>

<style>
#readacrossgrid {
  height: 100%;
  width:100%;
  .ag-cell-wrapper {
    height: 100%;
  }
  .ag-cell-value {
    height: 100%;
  }
  .ag-cell {
    padding-right: 0px;
    padding-left: 0px;
  }
  .ag-header-cell-text {
    color: #6E6E6E;
  }
}
</style>
