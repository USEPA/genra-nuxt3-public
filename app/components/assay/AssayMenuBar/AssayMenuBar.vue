<template>
  <div
    class="grid grid-cols-12 gap-2 ml-1 h-full max-h-full"
    data-testid="assayMenuBar"
  >
    <div
      class="col-span-3 h-full mt-6 mb-1"
    >
      <FloatLabel class="row-start-2">
        <Select
          v-model="selectedGroup"
          aria-labelledby="group-by-label"
          :aria-label="GROUP_LABEL_TEXT"
          input-id="group-by"
          :options="props.assayInputOptions"
          option-label="name"
          option-value="key"
          size="small"
          class="!w-full"
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
          id="group-by-label"
          for="group-by"
          class="!font-bold !text-[#6E6E77]"
        >{{ GROUP_LABEL_TEXT }}</label>
      </FloatLabel>
    </div>
    <div
      class="col-span-3 h-full mt-6 mb-1"
    >
      <FloatLabel class="row-start-2">
        <Select
          v-model="selectedBy"
          aria-labelledby="by-label"
          :aria-label="BY_LABEL_TEXT"
          input-id="by"
          :options="byOptions"
          option-label="name"
          option-value="key"
          size="small"
          class="!w-full"
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
          id="by-label"
          for="by"
          class="!font-bold !text-[#6E6E77]"
        >{{ BY_LABEL_TEXT }}</label>
      </FloatLabel>
    </div>
    <div
      class="col-span-2 h-full mb-1"
    >
      <label
        for="paginate-switch"
        class="text-xs !text-[#6E6E77] !font-bold"
      >{{ PAGINATION_LABEL_TEXT }}</label><br>
      <ToggleSwitch
        id="paginate-switch"
        v-model="paginate"
        :aria-label="PAGINATION_LABEL_TEXT"
        class="mt-1"
      />
    </div>
    <div
      class="col-span-3 self-center"
    >
      <Button
        label="Generate Data Matrix"
        class="sm:max-h-10 md:max-h-12 lg:max-h-16"
        :disabled="isGenerateBtnDisabled"
        @click="next"
      />
    </div>
    <div class="col-span-1 ml-0 self-center">
      <Help :help-key="HelpTextKey.ASSAY" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  GROUP_LABEL_TEXT, BY_LABEL_TEXT, PAGINATION_LABEL_TEXT,
} from './constants';
import type {RadialViewReportDbResponseItem} from '~/api/types';
import Help from '~/components/ui/Help/Help.vue';
import {HelpTextKey} from '~/components/ui/Help/constants';

const props = defineProps<{
  assayInputOptions: RadialViewReportDbResponseItem[];
  summarise: string;
  isReadAcrossLoading: boolean;
  sumrsBy: string;
  currentStep: number;
  paginate: boolean;
  isReadAcrossPanelAvailable: boolean;
}>();

const emits = defineEmits<{
  paginateChangeHandler: [shouldPaginate: boolean];
  assayDropdownChangeHandler: [group: string, isGroupChangeHandler?: boolean];
  next: [];
}>();

// Group dropdown
const selectedGroup = computed({
  get() {
    return props.summarise;
  },
  set(val) {
    if (val !== props.summarise && val) {
      emits('assayDropdownChangeHandler', val, true);
    }
  },
});

const byOptions = computed(() => {
  const currentGroupOptions = props.assayInputOptions
    ?.find(option => option.key === props.summarise)?.subFields;

  return currentGroupOptions || [];
});

// By Dropdown
const selectedBy = computed({
  get() {
    const byOption = byOptions.value.some(({key}) => key === props.sumrsBy);
    return byOption ? props.sumrsBy : byOptions.value?.[0]?.key;
  },
  set(val) {
    if (val !== props.sumrsBy && val) {
      emits('assayDropdownChangeHandler', val, false);
    }
  },
});

// Pagination Switch
const paginate = computed({
  get() {
    return props.paginate;
  },
  set(val: boolean) {
    emits('paginateChangeHandler', val);
  },
});

// Generate Data Matrix
const isGenerateBtnDisabled = computed(() => props.currentStep > 2 ||
  !props.isReadAcrossPanelAvailable);

const next = () => {
  if (!isGenerateBtnDisabled.value) {
    emits('next');
  }
};
</script>
