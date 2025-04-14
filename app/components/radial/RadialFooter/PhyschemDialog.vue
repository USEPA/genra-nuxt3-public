<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :header="PHYSCHEM_DIALOG_HEADER_TEXT"
    :style="{ width: '50rem', height: '50rem' }"
    position="center"
    data-testid="physchemDialog"
    close-on-escape
    content-class="!h-full !w-full"
    pt:root="relative resize overflow-auto min-w-[300px] min-h-[200px]"
  >
    <div class="!h-full !w-full">
      <iframe
        arira-label="Physchem Plot"
        title="Physchem Plot"
        class="flex-grow-1 !h-full !w-full"
        :srcdoc="props.physchemPlotUrl"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {PHYSCHEM_DIALOG_HEADER_TEXT} from '../constants';

const props = defineProps<{
  show: boolean;
  physchemPlotUrl: string;
}>();

const emits = defineEmits<{
  closeDialog: [];
}>();

const showDialog = computed({
  get() {
    return props.show;
  },
  set() {
    emits('closeDialog');
  },
});
</script>
