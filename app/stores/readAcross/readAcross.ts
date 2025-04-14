import fileSaver from 'file-saver';
import {DEFAULT_RUN_RRA_ERR_MSG} from './constants';
import type {
  ReadAcrossResponse, ReadAcrossColumnHeaderComponentParams, ReadAcrossCellItem,
  ReadAcrossItem,
  RunReadAcrossResponse,
} from '~/api/types';
import type {RunReadAcrossForm} from '~/components/readAcross/ReadAcrossMenuBar/types';

export const useReadAcrossStore = defineStore('readAcrossStore', () => {
  const baseStore = useAppBaseStore();
  const {$patch: baseStorePatch, showErrorHandler} = baseStore;
  const {params, currentStep} = storeToRefs(baseStore);

  const readAcrossResponse = ref<ReadAcrossResponse>();
  const runReadAcrossResponse = ref<RunReadAcrossResponse>();
  const isReadAcrossLoading = ref(false);

  const showSelectionChangeDialog = ref(false);

  const isReadAcrossPanelAvailable = computed(() => !isReadAcrossLoading.value &&
    !!readAcrossResponse.value?.columns.length && !!readAcrossResponse.value?.data.length);

  const currentChemInc = computed(() => {
    const currentReadAcrossCols = currentStep.value === 4 ?
      runReadAcrossResponse.value?.columns :
      readAcrossResponse.value?.columns;
    if (!currentReadAcrossCols) { return []; }
    return currentReadAcrossCols.filter(({field, hide}) => !field?.includes('_') && field !== 'physchem' && !hide)
      .map(column => ({
        chem_id: column.headerComponentParams.chem_id,
        isChecked: column.headerComponentParams.isChecked,
      }));
  });

  const getReadAcrossData = async() => {
    try {
      const {$repositores} = useNuxtApp();
      const readAcrossData = await $repositores.genra.getReadAcrossGrid(params.value);
      baseStorePatch((state) => {
        const predEngineWithData = readAcrossData.predEngines?.find(({data_exists: dataExists}) => !!dataExists)?.key;
        state.params.engine = predEngineWithData ?? null;
      });
      readAcrossResponse.value = readAcrossData;
    } finally {
      isReadAcrossLoading.value = false;
    }
  };

  const selectChemicalHandler = (colId: string) => {
    // Cannot change selections during final step
    if (currentStep.value > 3) {
      showSelectionChangeDialog.value = true;
      return;
    }
    const columnIdxToUpdate = readAcrossResponse.value?.columns
      .findIndex(column => column.headerComponentParams?.chem_id === colId);

    const clonedColumns = structuredClone(toRaw(readAcrossResponse.value?.columns));
    const clonedRows = structuredClone(toRaw(readAcrossResponse.value?.data));

    if (columnIdxToUpdate && columnIdxToUpdate >= 1 && clonedColumns && clonedRows) {
      const headerParams: ReadAcrossColumnHeaderComponentParams =
      clonedColumns[columnIdxToUpdate]?.headerComponentParams;
      const updatedBoolean = !headerParams.isChecked;
      if (clonedColumns[columnIdxToUpdate]?.headerComponentParams) {
        clonedColumns[columnIdxToUpdate].headerComponentParams = {
          ...clonedColumns[columnIdxToUpdate].headerComponentParams,
          isChecked: updatedBoolean,
        };
      }
      readAcrossResponse.value!.columns = clonedColumns;

      clonedRows.forEach((row) => {
        if (colId in row) {
          (row[colId as keyof ReadAcrossItem] as ReadAcrossCellItem).isChecked = updatedBoolean;
        }
      });

      readAcrossResponse.value!.data = clonedRows;
    }
  };

  const runReadAcross = async(raForm: RunReadAcrossForm) => {
    try {
      const {$repositores} = useNuxtApp();
      const {setStep} = useAppBaseStore();
      isReadAcrossLoading.value = true;
      const selectedChemicals = currentChemInc.value;

      const {
        simWeight, minMinus, minPlus, engine,
      } = raForm;
      baseStorePatch((state) => {
        state.params.engine = engine;
        state.params.pos0 = minPlus;
        state.params.neg0 = minMinus;
      });

      const runReadAcrossData = await $repositores.genra.getReadAcrossPredictions({
        ...params.value,
        useWidth: simWeight,
        chem_inc: selectedChemicals ?? [],
      });

      runReadAcrossResponse.value = runReadAcrossData;
      setStep(steps.findIndex(step => step === 'Step Five: Filter by Endpoint or Analogs'));
    } catch {
      showErrorHandler(new GenraApiError('', DEFAULT_RUN_RRA_ERR_MSG));
    } finally {
      isReadAcrossLoading.value = false;
    }
  };

  const setSimilarityWidthHandler = (simWidth: boolean) => {
    const isOnFinalStep = currentStep.value > 3;
    const clonedData = isOnFinalStep ?
      structuredClone(toRaw(runReadAcrossResponse.value?.data)) :
      structuredClone(toRaw(readAcrossResponse.value?.data));
    if (clonedData) {
      clonedData?.forEach((row) => {
        const keys = Object.keys(row);
        const vals = Object.values(row);
        if (!keys.includes('physchem')) {
          keys.forEach((key, idx) => {
            if (!key.includes('_')) {
              const updObj = vals[idx];
              if (typeof updObj === 'object') {
                if (simWidth) {
                  updObj.useWidth = updObj.similarity;
                } else {
                  updObj.useWidth = false;
                }
              }
            }
          });
        }
      });

      if (isOnFinalStep) {
        runReadAcrossResponse.value!.data = clonedData;
      } else {
        readAcrossResponse.value!.data = clonedData;
      }
    }
  };

  const readAcrossDownload = async(subdir: string, filter: string) => {
    const {$repositores} = useNuxtApp();
    const file = await $repositores.genra.genraDownload({
      ...params.value,
      subdir,
      chem_inc: currentChemInc.value,
      rra: currentStep.value === 4,
      ...(!!filter && {filter}),
    });

    const fileName = getFileNameFromHeaders(file.headers);
    fileSaver.saveAs(file._data as Blob, fileName);
  };

  return {
    readAcrossResponse,
    getReadAcrossData,
    isReadAcrossLoading,
    selectChemicalHandler,
    setSimilarityWidthHandler,
    isReadAcrossPanelAvailable,
    runReadAcrossResponse,
    readAcrossDownload,
    showSelectionChangeDialog,
    runReadAcross,
  };
});
