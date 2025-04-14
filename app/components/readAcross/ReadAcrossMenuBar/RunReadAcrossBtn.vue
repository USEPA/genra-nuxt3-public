<template>
  <Button
    :label="RUN_READ_ACROSS_BTN_TEXT"
    @click="emits('runReadAcross')"
  />
</template>

<script setup lang="ts">
import {
  RUN_READ_ACROSS_BTN_TEXT,
} from './constants';

const emits = defineEmits<{
  runReadAcross: [];
}>();
</script>
