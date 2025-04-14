<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :style="{ width: '25rem' }"
    position="center"
    data-cy="error-dialog"
    data-testid="errorDialog"
    close-on-escape
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2 text-red-700 text-2xl">
        Error
      </div>
    </template>
    {{ props.errorMsg }}
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  errorMsg: string;
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
