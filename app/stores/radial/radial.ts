/* eslint-disable camelcase */
import {useFingerprintStore} from '../fingerprint/fingerprint';
import {useAssayStore} from '../assay/assay';
import type {StartGenraFromNeParams} from './types';
import type {
  NeighborhoodGraphResponse, NeighborhoodGraphRequestParams, RadialViewResponse,
} from '~/api/types';
import {DEFAULT_GRAPH_NEIGHBORS} from '~/components/radial/NeighborhoodExplorer/Graph/constants';
import type {HybridFpOption} from '~/components/radial/types';

export const useRadialStore = defineStore('radialStore', () => {
  const baseStore = useAppBaseStore();
  const {$repositores} = useNuxtApp();
  const {
    getGenraData, $patch: baseStorePatch, setChemical,
  } = baseStore;
  const {
    setupResponse, params, currentStep,
  } = storeToRefs(baseStore);

  // Neighbor By dropdown
  const neighborByOptions = computed(() => setupResponse.value.neighbor_by);

  const neighborByChangeHandler = async(neighborBy: string) => {
    // Remove fp_weight
    // eslint-disable-next-line no-unused-vars
    const {fp_weight, ...existingParams} = params.value;
    baseStorePatch((state) => {
      state.params = {
        ...existingParams,
        fp: neighborBy,
      };
    });

    await getGenraData();
  };

  // Filter By dropdown
  const filterByOptions = computed(() => setupResponse.value.filter_by);

  const filterByChangeHandler = async(filterBy: string) => {
    baseStorePatch((state) => {
      state.params.sel_by = filterBy;
    });

    await getGenraData();
  };

  // # Of Analogues
  const numOfAnaloguesChangeHandler = async(numOfAnalogues: number) => {
    if (numOfAnalogues < 1 || numOfAnalogues > 15) { return; }

    baseStorePatch((state) => {
      state.params.k0 = numOfAnalogues;
    });

    await getGenraData();
  };

  // Radial response data
  const isRadialPanelLoading = ref(false);

  const radialResponse = ref<RadialViewResponse | Record<string, never>>({});

  const getRadialData = async() => {
    const {setStep} = baseStore;
    const neighbors = await $repositores.genra.getNeighbors(params.value);
    radialResponse.value = neighbors;

    baseStorePatch((state) => {
      state.params.sel_by = neighbors.sel_by;
      state.params.summarise = neighbors.report_db[0]?.key ?? state.params.summarise;
      state.params.sumrs_by = neighbors.report_db[0]?.subFields[0]?.key ?? state.params.sumrs_by;

      if (neighbors.flags) {
        state.params.flags = neighbors.flags;
      }
    });

    const [graphData, plotUrl] = await Promise.all([
      getGraphData({
        ...params.value,
        k0: DEFAULT_GRAPH_NEIGHBORS,
        fp: setupResponse.value.initGraphFPs.join(','),
        graph_type: setupResponse.value.graph_type?.[0]?.key ?? '',
      }), getPhyschemPlot(),
    ]);

    graphResponse.value = graphData as NeighborhoodGraphResponse;
    physchemPlotUrl.value = plotUrl;

    // Set to step 1 if starting workflow
    if (!!radialResponse.value.result.length && currentStep.value < 1) {
      setStep(1);
    }
  };

  // Physchem response data
  const physchemPlotUrl = ref('');

  const getPhyschemPlot = async() => {
    const {
      chem_id, k0, s0, fp, sel_by, fp_weight, flags,
    } = params.value;
    const plotData = await $repositores.genra.getPhyschemPlot({
      chem_id,
      k0,
      s0,
      fp,
      sel_by,
      ...(fp_weight && {fp_weight}),
      ...(flags && {flags}),
    });
    return plotData;
  };

  // Hybrid FP Handler
  const hybridFpChangeHandler = async(hybridOptions: HybridFpOption[]) => {
    const fp = hybridOptions.map(({key}) => key).join(',');
    const weights = hybridOptions.map(({weight}) => weight).join(',');
    baseStorePatch((state) => {
      state.params.fp = fp;
      state.params.fp_weight = weights;
    });
    await getGenraData();
  };

  // Neighborhood Explorer
  const graphResponse = ref<NeighborhoodGraphResponse>();

  const getGraphData = async(graphParams: NeighborhoodGraphRequestParams) => {
    try {
      const graphData = await $repositores.genra.getNeighborhoodGraph(graphParams);
      return graphData;
    } catch {
      return [];
    }
  };

  const startGenraFromNe = async({chemId, fromCustomNn}: StartGenraFromNeParams) => {
    baseStorePatch((state) => {
      if (currentStep.value !== 1) {
        state.currentStep = 1;
      }
      if (fromCustomNn) {
        state.params.flags = 'usernn';
      }
    });
    await setChemical({chem_id: chemId});
  };

  // Next Button - moving to next step 3
  const {isFingerprintPanelAvailable} = storeToRefs(useFingerprintStore());
  const {isAssayPanelAvailable} = storeToRefs(useAssayStore());

  const isNextDisabled = computed(() => {
    return isRadialPanelLoading.value ||
      !isFingerprintPanelAvailable.value || !isAssayPanelAvailable.value;
  });

  return {
    neighborByOptions,
    filterByOptions,
    isRadialPanelLoading,
    radialResponse,
    graphResponse,
    physchemPlotUrl,
    neighborByChangeHandler,
    getRadialData,
    filterByChangeHandler,
    numOfAnaloguesChangeHandler,
    startGenraFromNe,
    hybridFpChangeHandler,
    isNextDisabled,
  };
});
