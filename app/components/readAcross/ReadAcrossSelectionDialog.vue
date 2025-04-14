<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :header="READ_ACROSS_SELECTION_DIALOG_TITLE"
    :style="{ width: '25rem' }"
    position="center"
    data-cy="rra-selection-modal"
    data-testid="readAcrossSelectionDialog"
    close-on-escape
  >
    <div class="grid-cols-12">
      <div class="col-span-12">
        Changing selected settings will require re-calculating predictions,
        click "reset" to clear current predictions and "Run Read-Across" again,
        or "cancel" to retain current predictions.
      </div>
    </div>
    <template #footer>
      <Button
        severity="secondary"
        @click="emits('closeDialog')"
      >
        Cancel
      </Button>
      <Button
        severity="warn"
        @click="emits('reset')"
      >
        Reset
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {READ_ACROSS_SELECTION_DIALOG_TITLE} from './constants';

const props = defineProps<{
  show: boolean;
}>();

const emits = defineEmits<{
  closeDialog: [];
  reset: [];
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
