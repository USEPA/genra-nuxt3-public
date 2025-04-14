<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :header="KETCHER_DIALOG_TITLE"
    position="top"
    :style="{ width: '100rem', height: '100rem' }"
    close-on-escape
    content-class="!h-full !w-full"
    data-testid="ketcherDialog"
    :draggable="false"
  >
    <Ketcher @set-ketcher-obj="setKetcher" />
    <template #footer>
      <Button
        severity="secondary"
        @click="emits('closeDialog')"
      >
        Cancel
      </Button>
      <Button
        severity="success"
        @click="search"
      >
        Search
      </Button>
      <Message
        v-if="errorMsg"
        severity="error"
        class="grid-cols-12"
      >
        {{ errorMsg }}
      </Message>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Ketcher from '../Ketcher/Ketcher.vue';
import type {KetcherObj} from '../Ketcher/types';
import {KETCHER_DIALOG_TITLE, KETCHER_ERR_MSG} from './config';

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

onUnmounted(() => {
  errorMsg.value = '';
});

const ketcher = ref<KetcherObj | null>(null);
const setKetcher = (ketcherObj: KetcherObj) => {
  ketcher.value = Object.freeze(ketcherObj);
};

const errorMsg = ref('');

const {searchWithoutFlags} = useAppBaseStore();

const search = async() => {
  const smile = await ketcher.value?.getSmilesAsync();
  if (!smile) {
    errorMsg.value = KETCHER_ERR_MSG;
    return;
  }
  errorMsg.value = '';
  if (ketcher.value && smile) {
    await searchWithoutFlags(smile);
    showDialog.value = false;
  }
};
</script>
