<template>
  <div>
    <div>
      <label
        for="ra-paginate-switch"
        class="text-xs !text-[#6E6E77] !font-bold"
      >{{ PAGINATION_LABEL_TEXT }}</label><br>
      <ToggleSwitch
        id="ra-paginate-switch"
        v-model="paginate"
        :aria-label="PAGINATION_LABEL_TEXT"
        class="mt-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {UpdateRunReadAcrossFormParams} from './types';
import {PAGINATION_LABEL_TEXT} from '~/components/assay/AssayMenuBar/constants';

const props = defineProps<{
  paginate: boolean;
}>();

const emits = defineEmits<{
  updateReadAcrossForm: [val: UpdateRunReadAcrossFormParams];
}>();

const paginate = computed({
  get() {
    return props.paginate;
  },
  set(value) {
    emits('updateReadAcrossForm', {key: 'paginate', value});
  },
});
</script>
