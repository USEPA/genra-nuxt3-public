<template>
  <div
    class="h-full w-full"
    role="presentation"
    :style="{ opacity }"
  >
    <div
      ref="eLabel"
      class="ag-read-across-custom-header-cell-label content-center text-center h-full w-full pb-4"
      role="presentation"
      data-testid="readAcrossColumnHeader"
      @click="columnClickHandler"
    >
      <p
        v-if="!isHeaderColumn"
        class="text-base h-[15%] mb-1 text-[#6E6E6E]"
      >
        {{ Number.parseFloat(props.params.similarity.toString()).toFixed(2) }}
        <span
          v-if="props.params.targetChem"
          class="text-red-600"
        >
          {{ '&#8858;' }}
        </span>
        <span
          v-else-if="props.params.isChecked && !props.params.targetChem"
          class="text-green-600"
        >
          {{ '&#10004;' }}
        </span>
        <span
          v-else
          class="text-red-600"
        >
          {{ '&#10008;' }}
        </span>
      </p>
      <img
        v-if="!isHeaderColumn"
        class="h-[75%] w-full"
        :src="getSvgImgUrl(props.params.chem_id)"
        :alt="props.params.name"
      >
      <div>
        <span
          ref="eText"
          :class="`${columnTextClasses} inline-block text-[#6E6E6E]
          overflow-ellipsis whitespace-nowrap overflow-hidden content-center`"
        >
          {{ props.params.name }}

        </span>
        <div
          v-if="props.params.enableMenu"
          ref="menuButton"
          class="customHeaderMenuButton w-[25%] inline-block"
          data-testid="readAcrossColumnMenu"
          @click="onMenuClicked()"
        >
          <span
            class="ag-icon ag-icon-menu-alt cursor-pointer float-right mr-2"
            unselectable="on"
            role="presentation"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {IHeaderParams} from 'ag-grid-community';
import type {ReadAcrossHeaderComponentParams} from '../types';
import {useReadAcrossStore} from '~/stores/readAcross/readAcross';

const props = defineProps<{
  params: IHeaderParams & ReadAcrossHeaderComponentParams;
}>();

const readAcrossStore = useReadAcrossStore();
const {selectChemicalHandler} = readAcrossStore;

const menuButton = ref();

const opacity = computed(() => props.params.isChecked ? 1 : 0.5);

const isHeaderColumn = computed(() => props.params.chem_id === 'ep_name');

const columnTextClasses = computed(() => isHeaderColumn.value ? 'h-full text-sm w-[90%]' : 'h-[12%] text-base w-full');

const columnClickHandler = () => {
  selectChemicalHandler(props.params.column.getColId());
};

const onMenuClicked = () => {
  props.params.showColumnMenu(menuButton.value);
};
</script>
