<template>
  <FloatLabel variant="over">
    <InputNumber
      :model-value="props.numOfAnalogues"
      input-id="num-of-analogues"
      fluid
      size="small"
      mode="decimal"
      show-buttons
      :min="1"
      :max="15"
      @input="numberOfAnaloguesHandler"
    />
    <label for="num-of-analogues">Analogues:</label>
  </FloatLabel>
</template>

<script setup lang="ts">
import type {InputNumberInputEvent} from 'primevue';

const props = defineProps<{
  numOfAnalogues: number;
}>();

const emits = defineEmits<{
  numOfAnaloguesChangeHander: [numOfAnalogues: number];
}>();

const numberOfAnaloguesHandler = useDebounceFn((event: InputNumberInputEvent) => {
  emits('numOfAnaloguesChangeHander', event.value as number);
}, 500);
</script>
