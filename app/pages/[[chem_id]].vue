<template>
  <div class="overflow-x-clip">
    <NuxtLayout name="epa">
      <NuxtLoadingIndicator />
      <main>
        <div
          v-if=" currentStep < 1 && isRadialPanelLoading"
          class="text-center mt-32"
        >
          <ProgressSpinner
            style="width: 200px; height: 200px"
            stroke-width="8"
            fill="transparent"
            animation-duration=".5s"
            aria-label="Custom ProgressSpinner"
          />
        </div>
        <div class="grid grid-cols-12 m-1 min-h-[500px] mb-0">
          <transition
            name="fade"
            enter-active-class="animate__animated animate__fadeInLeft animate__delay-0.2s"
            leave-active-class="animate__animated animate__fadeOutLeft animate__delay-0.2s"
            mode="out-in"
          >
            <div
              v-if="currentStep >= 1"
              class="border-solid border border-[#ddd] sm:col-span-12 md:col-span-8 lg:col-span-5 xl:col-span-5 row-span-12"
            >
              <RadialPanel />
            </div>
          </transition>
          <transition
            enter-active-class="animate__animated animate__fadeIn animate__delay-0.2s"
            leave-active-class="animate__animated animate__fadeOut animate__delay-0.2s"
            mode="out-in"
          >
            <div
              v-if="currentStep >= 2"
              class="border-solid border border-[#ddd] sm:col-span-12
              md:col-span-4 lg:col-span-3 xl:col-span-3 row-span-12 min-h-[500px]"
            >
              <FingerprintPanel />
            </div>
          </transition>
          <transition
            enter-active-class="animate__animated animate__fadeInRight animate__delay-0.2s"
            leave-active-class="animate__animated animate__fadeOutRight animate__delay-0.2s"
            mode="out-in"
          >
            <div
              v-if="currentStep >= 2"
              class="border-solid border border-[#ddd] sm:col-span-12
               md:col-span-12 lg:col-span-4 xl:col-span-4 row-span-12 min-h-[500px]"
            >
              <AssayPanel />
            </div>
          </transition>
        </div>
        <transition
          enter-active-class="animate__animated animate__fadeInUp animate__delay-0.2s"
          leave-active-class="animate__animated animate__fadeOutDown animate__delay-0.2s"
          mode="out-in"
        >
          <div
            v-if="currentStep >= 3"
            class="border-solid border border-[#ddd] col-span-12 m-1 mt-0"
          >
            <ReadAcrossPanel />
          </div>
        </transition>
        <ErrorDialog
          :show="showErrorDialog"
          :error-msg="errorMsg"
          @close-dialog="showErrorDialog = false"
        />
      </main>
    </NuxtLayout>
  </div>
</template>

<script setup>
import RadialPanel from '~/components/radial/RadialPanel.vue';
import FingerprintPanel from '~/components/fingerprint/FingerprintPanel.vue';
import AssayPanel from '~/components/assay/AssayPanel.vue';
import ReadAcrossPanel from '~/components/readAcross/ReadAcrossPanel.vue';
import ErrorDialog from '~/components/ui/ErrorDialog/ErrorDialog.vue';
import {useRadialStore} from '~/stores/radial/radial';

useSeoMeta({
  title: 'GenRA',
  ogTitle: 'GenRA',
  description: 'Generalized Read-Across',
  ogDescription: 'Generalized Read-Across',
});

const baseStore = useAppBaseStore();
const {
  currentStep, errorMsg, showErrorDialog,
} = storeToRefs(baseStore);
const {setChemical} = baseStore;

onBeforeMount(() => {
  const route = useRoute();
  if (route.params.chem_id && currentStep.value < 1) {
    setChemical({
      chem_id: route.params.chem_id,
    });
  }
});

const {isRadialPanelLoading} = storeToRefs(useRadialStore());
</script>

<style>
.main-content {
  min-height: 300px;
}
</style>
