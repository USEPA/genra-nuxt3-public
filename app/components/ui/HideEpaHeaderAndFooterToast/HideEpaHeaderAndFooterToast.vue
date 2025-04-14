<template>
  <Toast data-testid="hideEpaAndFooterToast" />
</template>

<script setup lang="ts">
import {useToast} from 'primevue/usetoast';
import {HIDE_EPA_HEADER_FOOTER_MSG} from './constants';

const props = defineProps<{
  showEpaHeaderAndFooter: boolean;
}>();

const emits = defineEmits<{
  hideEpaHeaderFooter: [];
}>();

const toast = useToast();

const showToast = () => {
  toast.add({
    severity: 'info',
    life: 10000,
    summary: 'Hiding EPA header and footer',
    detail: HIDE_EPA_HEADER_FOOTER_MSG,
  });
};

onMounted(() => {
  if (props.showEpaHeaderAndFooter) {
    setTimeout(() => {
      showToast();
      emits('hideEpaHeaderFooter');
    }, 1000);
  }
});
</script>
