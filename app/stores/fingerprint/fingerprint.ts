import type {FingerprintHeatChartResponse} from '~/api/types';

export const useFingerprintStore = defineStore('fingerprintStore', () => {
  const fingerprintResponse = ref<FingerprintHeatChartResponse | Record<string, never>>({});
  const isFingerprintLoading = ref(false);

  const baseStore = useAppBaseStore();
  const {params} = storeToRefs(baseStore);

  const isFingerprintPanelAvailable = computed(() => !isFingerprintLoading.value &&
    !!fingerprintResponse.value?.data?.length &&
    !!fingerprintResponse.value?.columns?.length);

  const getFingerprintData = async() => {
    const {$repositores} = useNuxtApp();
    const fpResponse = await $repositores.genra.getFingerprintGrid(params.value);
    fingerprintResponse.value = fpResponse;
  };

  return {
    getFingerprintData,
    isFingerprintPanelAvailable,
    fingerprintResponse,
    isFingerprintLoading,
  };
});
