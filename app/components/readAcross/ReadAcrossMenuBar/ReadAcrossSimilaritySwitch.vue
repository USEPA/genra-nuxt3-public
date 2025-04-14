<template>
  <div>
    <label
      for="paginate-switch"
      class="text-xs !text-[#6E6E77] !font-bold"
    >{{ SIMILARITY_LABEL_TEXT }}</label><br>
    <ToggleSwitch
      id="paginate-switch"
      v-model="similarity"
      :aria-label="SIMILARITY_LABEL_TEXT"
      class="mt-1"
    />
  </div>
</template>

<script setup lang="ts">
import {SIMILARITY_LABEL_TEXT} from './constants';
import type {UpdateRunReadAcrossFormParams} from './types';

const props = defineProps<{
  simWeight: boolean;
}>();

const emits = defineEmits<{
  updateReadAcrossForm: [val: UpdateRunReadAcrossFormParams];

}>();

const similarity = computed({
  get() {
    return props.simWeight;
  },
  set(value) {
    if (value !== props.simWeight) {
      emits('updateReadAcrossForm', {key: 'simWeight', value});
    }
  },
});
</script>
