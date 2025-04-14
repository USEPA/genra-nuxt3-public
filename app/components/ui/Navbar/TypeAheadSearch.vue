<template>
  <AutoComplete
    ref="autoCompleteRef"
    v-model="searchText"
    :placeholder="placeHolderText"
    :suggestions="items"
    dropdown
    :min-length="3"
    option-label="name"
    class="w-96 h-10"
    :dropdown-icon="PrimeIcons.SEARCH"
    :pt="{
      pcInputText: {
        root: 'w-96',
      },
      listContainer: {
        class: 'w-96',
      },
      emptyMessage: {
        class: isSearching ? 'text-center' : '',
      },
      dropdown: {
        'aria-label': 'Search Options',
      },
    }"
    @complete="search"
    @option-select="selectOption"
  >
    <template #option="slotProps">
      <div v-tooltip="`${slotProps.option.name} - ${slotProps.option.dsstox_cid}}`">
        <strong>{{ slotProps.option.name }}</strong> <br> <i>{{ slotProps.option.dsstox_cid }}</i>
      </div>
    </template>
    <template #empty>
      <span
        v-if="isSearching"
        class="text-center"
      > <ProgressSpinner
        style="width: 50px; height: 50px"
        stroke-width="8"

        fill="transparent"
        animation-duration=".5s"
        aria-label="Custom ProgressSpinner"
      /></span>
      <span v-else>
        {{ emptyMessage }}
      </span>
    </template>
  </AutoComplete>
</template>

<script setup lang="ts">
import type {
  AutoCompleteOptionSelectEvent,
} from 'primevue';
import {PrimeIcons} from '@primevue/core';
import {TYPEAHEAD_SEARCH_PLACEHOLDER_TXT} from './config';
import type {SearchResponseItem} from '~/api/types';

const searchText = ref('');
const items = ref<SearchResponseItem[]>([]);
const isSearching = ref(false);
const emptyMessage = ref(TYPEAHEAD_SEARCH_PLACEHOLDER_TXT);
const autoCompleteRef = ref();

const baseStore = useAppBaseStore();
const {searchWithoutFlags, showErrorHandler} = baseStore;
const {
  params, setupResponse,
} = storeToRefs(baseStore);
const placeHolderText = computed(() => !!params.value?.chem_id && !!setupResponse.value?.name ?
  `${setupResponse.value?.name} ${params.value?.chem_id}` :
  TYPEAHEAD_SEARCH_PLACEHOLDER_TXT);
watch(() => params.value?.chem_id, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    searchText.value = '';
  }
}, {deep: true});

const search = async() => {
  try {
    if (searchText.value.length <= 2) {
      return;
    }
    autoCompleteRef.value.overlayVisible = true;
    isSearching.value = true;
    emptyMessage.value = TYPEAHEAD_SEARCH_PLACEHOLDER_TXT;
    items.value = [];

    const {$repositores} = useNuxtApp();
    const searchResults = await $repositores.genra.chemicalSearch(searchText.value);
    if (!searchResults.hits.length) {
      items.value = [];
      emptyMessage.value = 'No results found. Please try again.';
      return;
    }

    items.value = searchResults.hits;

    // Auto focus first available option
    autoCompleteRef.value.focusedOptionIndex = 0;
  } catch (err) {
    searchText.value = '';
    showErrorHandler(err);
  } finally {
    isSearching.value = false;
  }
};

const selectOption = (event: AutoCompleteOptionSelectEvent) => {
  const selection = event.value as SearchResponseItem;
  searchWithoutFlags(toRaw(selection.chem_id));
};
</script>
