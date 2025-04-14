import {useRadialStore} from '../radial/radial';
import {useReadAcrossStore} from '../readAcross/readAcross';
import type {AssayResponse} from '~/api/types';

export const useAssayStore = defineStore('assayStore', () => {
  const assayResponse = ref<AssayResponse>();
  const isAssayLoading = ref(false);

  const baseStore = useAppBaseStore();
  const {$patch: baseStorePatch} = baseStore;
  const {params, currentStep} = storeToRefs(baseStore);

  const isAssayPanelAvailable = computed(() => !isAssayLoading.value &&
    !!assayResponse.value?.data.length &&
    !!assayResponse.value?.columns.length);

  const getAssayData = async() => {
    try {
      const {$repositores} = useNuxtApp();
      const assayData = await $repositores.genra.getAssayGrid(params.value);
      if (assayData.flags) {
        baseStorePatch((state) => {
          state.params.flags = assayData.flags;
        });
      }
      assayResponse.value = assayData;
      return assayData;
    } finally {
      isAssayLoading.value = false;
    }
  };

  const assayDropdownChangeHandler = async(val: string, isGroupChangeHandler: boolean = true) => {
    const {radialResponse} = useRadialStore();
    const {getReadAcrossData, $patch: readAcrossPatch} = useReadAcrossStore();
    isAssayLoading.value = true;
    const paramsKey = isGroupChangeHandler ? 'summarise' : 'sumrs_by';
    const sumrsBy = isGroupChangeHandler ?
      radialResponse.report_db
        .find(({key}) => key === val)
        ?.subFields.find(({data_exists: dataExists}) => !!dataExists)
        ?.key :
      null;

    baseStorePatch((state) => {
      state.params.sumrs_by = sumrsBy ?? state.params.sumrs_by;
      if (paramsKey in state.params) {
        state.params[paramsKey] = val;
      }

      if (currentStep.value > 3) {
        state.currentStep = 3;
      }
    });

    readAcrossPatch({
      isReadAcrossLoading: true,
    });

    await getAssayData();
    await getReadAcrossData();
  };

  return {
    assayResponse,
    getAssayData,
    isAssayLoading,
    isAssayPanelAvailable,
    assayDropdownChangeHandler,
  };
});
