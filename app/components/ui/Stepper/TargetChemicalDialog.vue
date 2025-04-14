<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :header="TARGET_CHEMICAL_DIALOG_TITLE"
    data-testid="targetChemicalDialog"
    :style="{ width: '25rem' }"
    position="top"
    close-on-escape
  >
    <div class="grid gap-4">
      <div
        v-if="dtxcid"
        class="grid-cols-12"
      >
        <strong class="mr-2">DTXCID:</strong> {{ dtxcid }}
      </div>
      <div
        v-if="dtxsid"
        class="grid-cols-12"
      >
        <strong class="mr-2">DTXSID:</strong> {{ dtxsid }}
      </div>
      <div
        v-if="chemId"
        class="grid-cols-12"
      >
        <strong class="mr-2">{{ chemIdLabel }}:</strong> {{ chemId }}
      </div>
      <div
        v-if="chemName"
        class="grid-cols-12"
      >
        <strong class="mr-2">Name:</strong> {{ chemName }}
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {TARGET_CHEMICAL_DIALOG_TITLE} from './constants';

const props = defineProps<{
  show: boolean;
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

const {
  isMultiTarget, isCustomNn, setupResponse,
} = storeToRefs(useAppBaseStore());

const dtxcid = computed(() => {
  if (setupResponse.value.dsstox_cid && !isMultiTarget.value) {
    return setupResponse.value.dsstox_cid;
  }
  return '';
});

const dtxsid = computed(() => {
  if (setupResponse.value.dsstox_sid && !isMultiTarget.value) {
    return setupResponse.value.dsstox_sid;
  }
  return '';
});

const chemId = computed(() => {
  if ([dtxcid.value, dtxsid.value].includes(setupResponse.value.chem_id)) {
    return '';
  }
  return setupResponse.value.chem_id;
});

const chemIdLabel = computed(() => {
  if (isMultiTarget.value) { return 'Targets'; }
  if (isCustomNn.value) { return 'Neighbors'; }
  return 'Chem ID';
});

const chemName = computed(() => !!setupResponse.value.name && !isMultiTarget.value ? setupResponse.value.name : '');
</script>
