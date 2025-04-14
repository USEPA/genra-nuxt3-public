<template>
  <div class="grid grid-cols-2">
    <div class="col-span-1">
      <FloatLabel class="row-start-2">
        <Select
          v-model="selectedMinPos"
          aria-labelledby="min-pos-label"
          :aria-label="MIN_POS_OBSERVATION_LABEL_TEXT"
          input-id="min-pos"
          :options="MIN_OPTIONS"
          size="small"
          @change="selectedMinPosChangeHandler"
        />
        <label
          id="min-pos-label"
          for="min-pos"
          class="!font-bold !text-[#6E6E77]"
        >{{ MIN_POS_OBSERVATION_LABEL_TEXT }}</label>
      </FloatLabel>
    </div>
    <div class="col-span-1">
      <FloatLabel class="row-start-2">
        <Select
          v-model="selectedMinNeg"
          aria-labelledby="min-neg-label"
          :aria-label="MIN_NEG_OBSERVATION_LABEL_TEXT"
          input-id="min-neg"
          :options="MIN_OPTIONS"
          size="small"
          @change="selectedMinNegChangeHandler"
        />
        <label
          id="min-neg-label"
          for="min-neg"
          class="!font-bold !text-[#6E6E77]"
        >{{ MIN_NEG_OBSERVATION_LABEL_TEXT }}</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {SelectChangeEvent} from 'primevue';
import {
  MIN_POS_OBSERVATION_LABEL_TEXT,
  MIN_NEG_OBSERVATION_LABEL_TEXT, MIN_OPTIONS,
} from './constants';
import type {UpdateRunReadAcrossFormParams} from './types';

const props = defineProps<{
  minPos: number;
  showSelectionChangeDialog: boolean;
  minNeg: number;
  currentStep: number;
}>();

const emits = defineEmits<{
  updateReadAcrossForm: [val: UpdateRunReadAcrossFormParams];
}>();

const selectedMinPos = ref(props.minPos);
const previousSelectedMinPos = ref(props.minPos);
const selectedMinPosChangeHandler = (event: SelectChangeEvent) => {
  const {value} = event;
  if (value !== props.minPos) {
    previousSelectedMinPos.value = props.minPos;
    emits('updateReadAcrossForm', {key: 'minPlus', value});
  }
};

const selectedMinNeg = ref(props.minNeg);
const previousSelectedMinNeg = ref(props.minNeg);
const selectedMinNegChangeHandler = (event: SelectChangeEvent) => {
  const {value} = event;
  if (value !== props.minNeg) {
    previousSelectedMinNeg.value = props.minNeg;
    emits('updateReadAcrossForm', {key: 'minMinus', value});
  }
};

// Reset min+ and min- if user presses close/cancel on selection dialog
watch(() => props.showSelectionChangeDialog, (newVal, oldVal) => {
  if (!newVal && oldVal && props.currentStep === 4) {
    nextTick(() => {
      selectedMinPos.value = previousSelectedMinPos.value;
      emits('updateReadAcrossForm', {
        key: 'minPlus', value: previousSelectedMinPos.value, fromCancelSelectionDialog: true,
      });

      selectedMinNeg.value = previousSelectedMinNeg.value;
      emits('updateReadAcrossForm', {
        key: 'minMinus', value: previousSelectedMinNeg.value, fromCancelSelectionDialog: true,
      });
    });
  }
});
</script>
