<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :header="MORE_INFO_DIALOG_TITLE"
    :style="{ width: '25rem' }"
    position="top"
    data-testid="moreInfoDialog"
    close-on-escape
  >
    <div class="grid gap-4">
      <div class="grid-cols-12">
        <strong class="mr-2">Version:</strong> {{ props.version || '' }}
      </div>
      <div class="grid-cols-12">
        <strong
          class="mr-2"
        >Contact:</strong>
        <nuxt-link
          v-for="({ href, label, target, title, icon }) in CONTACT_LINKS"
          :key="label"
          :to="href"
          :title="title"
          :target="target"
        >
          {{ label }} <i
            v-if="icon"
            :class="`pi ${icon}`"
          />
        </nuxt-link>
      </div>
      <div class="grid-cols-12">
        <strong class="mr-2">Documentation:</strong>
        <nuxt-link
          v-for="({ href, label, target, title, icon }) in DOCUMENTATION_LINKS"
          :key="label"
          :to="href"
          :target="target"
          :title="title"
        >
          {{ label }} <i
            v-if="icon"
            :class="`pi ${icon}`"
          />
        </nuxt-link>
      </div>
      <div class="grid-cols-12">
        <strong class="mr-2">Publications:</strong>
        <template
          v-for="({ href, label, target, title }, idx) in PUBLICATION_LINKS"
          :key="label"
        >
          <nuxt-link
            :to="href"
            :title="title"
            :target="target"
          >
            {{ label }}
          </nuxt-link>
          {{ idx !== PUBLICATION_LINKS.length - 1 ? ', ' : '' }}
        </template>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import {
  PUBLICATION_LINKS, DOCUMENTATION_LINKS, CONTACT_LINKS, MORE_INFO_DIALOG_TITLE,
} from './config';

const props = defineProps<{
  show: boolean;
  version: string | undefined;
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
