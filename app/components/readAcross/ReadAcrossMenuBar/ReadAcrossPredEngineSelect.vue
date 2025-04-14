<template>
  <FloatLabel class="row-start-2">
    <Select
      v-model="selectedEngine"
      aria-labelledby="engine-label"
      :aria-label="ENGINE_LABEL_TEXT"
      input-id="engine"
      :options="props.predEngines"
      option-label="name"
      option-value="key"
      size="small"
      @change="selectedEngineChangeHandler"
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
      id="engine-label"
      for="engine"
      class="!font-bold !text-[#6E6E77]"
    >{{ ENGINE_LABEL_TEXT }}</label>
  </FloatLabel>
</template>

<script setup lang="ts">
import type {SelectChangeEvent} from 'primevue';
import {
  ENGINE_LABEL_TEXT,
} from './constants';
import type {UpdateRunReadAcrossFormParams} from './types';
import type {BaseItem} from '~/api/types';

const props = defineProps<{
  predEngines: BaseItem[] | undefined;
  engine: string | null;
  showSelectionChangeDialog: boolean;
  currentStep: number;
}>();

const emits = defineEmits<{
  updateReadAcrossForm: [val: UpdateRunReadAcrossFormParams];
}>();

const selectedEngine = ref(props.engine);

const previousSelectedEngine = ref(props.engine);

// This can occur when any of the other panel inputs change and previously selected engine is now unavailable
watch(() => props.engine, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    selectedEngine.value = newVal;
    previousSelectedEngine.value = newVal;
  }
});
const selectedEngineChangeHandler = (event: SelectChangeEvent) => {
  const {value} = event;
  if (value !== props.engine) {
    previousSelectedEngine.value = props.engine;
    emits('updateReadAcrossForm', {key: 'engine', value});
  }
};

// Reset engine if user presses close/cancel on selection dialog
watch(() => props.showSelectionChangeDialog, (newVal, oldVal) => {
  if (!newVal && oldVal && props.currentStep === 4) {
    nextTick(() => {
      selectedEngine.value = previousSelectedEngine.value;
      emits('updateReadAcrossForm', {
        key: 'engine', value: previousSelectedEngine.value, fromCancelSelectionDialog: true,
      });
    });
  }
});
</script>
