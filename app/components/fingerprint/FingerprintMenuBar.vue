<template>
  <div class="grid grid-cols-12 items-center h-full">
    <div class="col-span-11 ml-4 !font-bold !text-[#6E6E77]">
      {{ FINGERPRINT_PANEL_HEADER_TEXT }}
    </div>
    <div class="col-span-1">
      <Help :help-key="HelpTextKey.FINGERPRINT" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Help from '../ui/Help/Help.vue';
import {HelpTextKey} from '../ui/Help/constants';
import {FINGERPRINT_PANEL_HEADER_TEXT} from './constants';
</script>
