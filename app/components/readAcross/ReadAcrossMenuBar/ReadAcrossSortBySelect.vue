<template>
  <FloatLabel class="row-start-2">
    <Select
      v-model="selectedSortBy"
      aria-labelledby="sort-by-label"
      :aria-label="SORT_LABEL_TEXT"
      input-id="sort-by"
      :options="props.sortOptions"
      option-label="name"
      option-value="key"
      size="small"
    >
      <template #option="slotProps">
        <div
          v-tooltip="slotProps.option.description"
          class="flex align-items-center"
        >
          {{ slotProps.option.name }}
        </div>
      </template>
    </Select>
    <label
      id="sort-by-label"
      for="sort-by"
      class="!font-bold !text-[#6E6E77]"
    >{{ SORT_LABEL_TEXT }}</label>
    <Button
      v-tooltip="sortBtnLabel"
      size="small"
      :icon="sortBtnIcon"
      :aria-label="sortBtnLabel"
      class="ml-1"
      @click="sortOrderHandler"
    />
  </FloatLabel>
</template>

<script setup lang="ts">
import {
  SORT_LABEL_TEXT,
} from './constants';
import type {SortOrder, UpdateRunReadAcrossFormParams} from './types';
import type {BaseItem} from '~/api/types';

const props = defineProps<{
  sortOptions: BaseItem[] | undefined;
  sortBy: string | undefined;
  sortOrder: SortOrder;
}>();

const emits = defineEmits<{
  updateReadAcrossForm: [val: UpdateRunReadAcrossFormParams];
}>();

const selectedSortBy = computed({
  get() {
    return props.sortBy;
  },
  set(value) {
    if (value !== props.sortBy) {
      emits('updateReadAcrossForm', {
        key: 'sortBy', value,
      });
    }
  },
});

// Sort Button
const currentSortOrder = computed({
  get() {
    return props.sortOrder;
  },
  set(value) {
    if (value !== props.sortOrder) {
      emits('updateReadAcrossForm', {
        key: 'sortOrder', value,
      });
    }
  },
});

const sortOrderHandler = () => {
  currentSortOrder.value = currentSortOrder.value === 'asc' ? 'desc' : 'asc';
};

const sortBtnIcon = computed(() => {
  // icons for alphabetacal sorts
  if (selectedSortBy.value === 'alphaName') {
    return currentSortOrder.value === 'asc' ? 'pi pi-sort-alpha-down' : 'pi pi-sort-alpha-up-alt';
  }
  // default icons
  return currentSortOrder.value === 'asc' ? 'pi pi-sort-amount-down-alt' : 'pi pi-sort-amount-up';
});

const sortBtnLabel = computed(() => {
  const sortDesc = props.sortOptions?.find(({key}) => key === selectedSortBy.value)?.name;
  return `Click to toggle between ascending and descending ${sortDesc ?? ''}`;
});
</script>
