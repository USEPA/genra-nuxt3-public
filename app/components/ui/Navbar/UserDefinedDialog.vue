<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :header="USER_DEFINED_DIALOG_TITLE"
    :style="{ width: '35rem' }"
    position="top"
    data-testid="userDefinedDialog"
    close-on-escape
  >
    <div class="grid gap-4">
      <div class="grid-cols-12">
        <Textarea
          v-model.trim="searchInput"
          rows="5"
          class="w-full"
          :placeholder="USER_DEFINED_DIALOG_PLACEHOLDER_TXT"
        />
        <Message
          size="small"
          severity="secondary"
          variant="simple"
        >
          Target chemicals may consist of SID's, CID's, SMILES, or CASRN's and must be
          separated by commas or placed on separate lines. <br>
          <strong>ex: DTXCID90710, DTXSID3040352, 80-05-7, O=C=O</strong>
        </Message>
      </div>
      <div class="grid-cols-12 flex items-center gap-2">
        <Checkbox
          v-model="predictionsChecked"
          binary
          input-id="predictionsChecked"
        />
        <label
          for="predictionsChecked"
        > Make predictions for all chemicals </label>
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
        severity="success"
        :disabled="isSearchDisabled"
        @click="search"
      >
        Search
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {USER_DEFINED_DIALOG_TITLE, USER_DEFINED_DIALOG_PLACEHOLDER_TXT} from './config';

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

// Input text
const searchInput = ref('');

const predictionsChecked = ref(false);

// Dialog Actions
const isSearchDisabled = computed(() => !searchInput.value || searchInput.value.split('').every(char => char === ','));

const {searchFromMultiTarget} = useAppBaseStore();
const search = () => {
  if (!isSearchDisabled.value) {
    const parsedSearchInput = searchInput.value
      .split(/[,\\\n]/)
      .filter(str => str.length)
      .map(str => str.trim())
      .join(',');
    searchFromMultiTarget({chem_id: parsedSearchInput}, predictionsChecked.value);
    showDialog.value = false;
  }
};
</script>
