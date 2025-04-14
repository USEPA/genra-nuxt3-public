<template>
  <div
    class="ketcher-container !w-full !h-full"
  >
    <iframe
      ref="ketcherRef"
      class="!w-full !h-full"
      title="Ketcher"
      :src="ketcherSrc"
    />
  </div>
</template>

<script setup lang="ts">
import type {KetcherObj} from './types';

const {APPLICATION_ROUTER_BASE} = useRuntimeConfig().public;
const ketcherSrc = `${APPLICATION_ROUTER_BASE}ketcher/index.html`;

const emits = defineEmits<{
  setKetcherObj: [ketcher: KetcherObj];
}>();

const ketcherRef = ref<HTMLIFrameElement | null>(null);
const ketcherInterval = ref<null | ReturnType<typeof setInterval>>(null);
onMounted(() => {
  ketcherInterval.value = setInterval(() => {
    initiateKetcher();
  }, 1000);
  window.addEventListener('beforeunload', () => {
    removeKetcher();
  });
});

onUnmounted(() => {
  removeKetcher();
});

const removeKetcher = () => {
  clearInterval(ketcherInterval.value as unknown as number);
};

const initiateKetcher = () => {
  const ketcher = ketcherRef.value?.contentWindow?.ketcher as KetcherObj || {};
  if (ketcher && 'standalone' in ketcher) {
    clearInterval(ketcherInterval.value as ReturnType<typeof setInterval>);
    emits('setKetcherObj', ketcher);
  }
};
</script>

<style scoped>

</style>
