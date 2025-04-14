<template>
  <div class="grid h-full">
    <BlockUI :blocked="isFingerprintLoading || isRadialPanelLoading">
      <div class="col-span-12 bg-[#e8f6fd] border-solid border-b border-[#ddd] h-[13%]">
        <FingerprintMenuBar />
      </div>
      <div class="col-span-12 h-[87%]">
        <FingerprintGrid :fingerprint-response="fingerprintResponse" />
      </div>
    </BlockUI>
  </div>
</template>

<script setup lang="ts">
import FingerprintMenuBar from './FingerprintMenuBar.vue';
import FingerprintGrid from './FingerprintGrid/FingerprintGrid.vue';
import {useFingerprintStore} from '~/stores/fingerprint/fingerprint';
import {useRadialStore} from '~/stores/radial/radial';

const fpStore = useFingerprintStore();

const {fingerprintResponse, isFingerprintLoading} = storeToRefs(fpStore);

const {isRadialPanelLoading} = storeToRefs(useRadialStore());
</script>
