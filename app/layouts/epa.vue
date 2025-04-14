<template>
  <div v-auto-animate>
    <EpaHeader v-if="showEpaHeaderAndFooter" />
    <Navbar :version="version" />
    <Stepper :current-step="currentStep" />
    <slot />
    <VueAxePopup v-if="showAxePopup" />
    <EpaFooter v-if="showEpaHeaderAndFooter" />
    <HideEpaHeaderAndFooterToast
      :show-epa-header-and-footer="showEpaHeaderAndFooter"
      @hide-epa-header-footer="showEpaHeaderAndFooter = false"
    />
  </div>
</template>

<script setup>
import {VueAxePopup} from 'vue-axe';
import HideEpaHeaderAndFooterToast from '../components/ui/HideEpaHeaderAndFooterToast/HideEpaHeaderAndFooterToast.vue';
import Navbar from '~/components/ui/Navbar/Navbar.vue';
import Stepper from '~/components/ui/Stepper/Stepper.vue';

const {$repositores} = useNuxtApp();

const {data: version} = await useWrapperAsyncData('version', () => $repositores.genra.getVersion());

const {currentStep} = storeToRefs(useAppBaseStore());

useHead({
  htmlAttrs: {
    lang: 'en-US',
  },
});
const {APPLICATION_ENVIRONMENT_LABEL} = useRuntimeConfig().public;
const showAxePopup = ref(false);

const {showEpaHeaderAndFooter} = storeToRefs(useAppBaseStore());
onMounted(() => {
  if (APPLICATION_ENVIRONMENT_LABEL.toLowerCase().includes('dev')) {
    showAxePopup.value = true;
  }
});
</script>

<style>
body {
  background-color: #ffffff;
}
</style>
