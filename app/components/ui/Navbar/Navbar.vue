<template>
  <ClientOnly>
    <header aria-label="GenRA Navigation">
      <Menubar
        :model="items"
        class="bg-primary !text-white !rounded-none"
        :pt="{
          item: {
            'aria-level': null,
          },
          itemLabel: {
            class: 'text-lg',
          },
          itemIcon: {
            class: 'text-lg',
          },
        }"
      >
        <template #start>
          <nuxt-link
            to="https://www.epa.gov"
            class="text-xl text-white font-medium"
            target="_blank"
            external
          >
            <img
              src="/epa_logo.png"
              alt="EPA Logo"
            >
          </nuxt-link>
          <h1 class="ml-4 text-lg text-white font-normal">
            Generalized Read-Across (GenRA)
          </h1>
        </template>
        <template #end>
          <div class="flex items-center gap-2">
            <TypeAheadSearch />
            <Button
              v-tooltip="epaHeaderFooterBtnAttr.tooltip"
              severity="primary"
              :icon="epaHeaderFooterBtnAttr.icon"
              :class="epaHeaderFooterBtnAttr.class"
              :aria-label="epaHeaderFooterBtnAttr.tooltip"
              :pt="{
                icon: { class: `${epaHeaderFooterBtnAttr.ptIconClass}` },
              }"
              @click="showEpaHeaderAndFooter = !showEpaHeaderAndFooter"
            />
          </div>
        </template>
      </Menubar>
      <MoreInfoDialog
        :show="showMoreInfoDialog"
        :version="props.version"
        @close-dialog="showMoreInfoDialog = false"
      />
      <KetcherDialog
        :show="showKetcherDialog"
        @close-dialog="showKetcherDialog = false"
      />
      <UserDefinedDialog
        :show="showUserDefinedDialog"
        @close-dialog="showUserDefinedDialog = false"
      />
    </header>
  </ClientOnly>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar';
import type {MenuItem} from 'primevue/menuitem';
import {PrimeIcons} from '@primevue/core/api';
import MoreInfoDialog from './MoreInfoDialog.vue';
import KetcherDialog from './KetcherDialog.vue';
import UserDefinedDialog from './UserDefinedDialog.vue';
import TypeAheadSearch from './TypeAheadSearch.vue';

const props = defineProps<{
  version: string | undefined;
}>();

// Epa Header & Footer
const useHeader = useAppBaseStore();
const {showEpaHeaderAndFooter} = storeToRefs(useHeader);

const epaHeaderFooterBtnAttr = computed(() => {
  if (showEpaHeaderAndFooter.value) {
    return {
      tooltip: 'Click to hide EPA header',
      icon: 'pi pi-arrow-down-left-and-arrow-up-right-to-center',
      class: 'btn mx-2 !border-0',
      ptIconClass: '!text-2xl',
    };
  }

  return {
    tooltip: 'Click to show EPA header',
    icon: 'pi pi-arrow-up-right-and-arrow-down-left-from-center',
    class: 'btn mx-2 !border-0',
    ptIconClass: 'pt-2 text-2xl',
  };
});

// Title & More Info
const showMoreInfoDialog = ref(false);

const items = ref<MenuItem[]>([
  {
    label: 'More Info',
    icon: PrimeIcons.INFO_CIRCLE,
    class: 'text-xs ml-4',
    command: () => {
      showMoreInfoDialog.value = true;
    },
  },
  {
    label: 'Ketcher',
    icon: PrimeIcons.PENCIL,
    class: 'text-xs ml-8',
    command: () => {
      showKetcherDialog.value = true;
    },
  },
  {
    label: 'User-defined',
    icon: PrimeIcons.SEARCH,
    class: 'text-xs',
    command: () => {
      showUserDefinedDialog.value = true;
    },
  },
]);

// Ketcher
const showKetcherDialog = ref(false);

// User Defined NN
const showUserDefinedDialog = ref(false);
</script>
