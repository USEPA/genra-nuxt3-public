import {
  beforeEach, describe, expect, it,
  vi,
} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {useReadAcrossStore} from './readAcross';
import {DEFAULT_RUN_RRA_ERR_MSG} from './constants';
import {mockGenraEndpoint} from '~/test/vitest/helpers';
import {assayMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/AssayMocks';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import {
  getReadAcrossMockResponseForBpaAndTenNeighbors, runReadAcrossMockResponseForBpaAndTenNeighbors,
} from '~/test/vitest/mockData/api/ReadAcrossMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';

const readAcrossResponse = vi.fn();
const runReadAcrossResponse = vi.fn();

mockGenraEndpoint('RADIAL', radialMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('FINGERPRINT', fingerprintMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('ASSAY', assayMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('GET_READACROSS', getReadAcrossMockResponseForBpaAndTenNeighbors, {handler: readAcrossResponse});
mockGenraEndpoint('RUN_READACROSS', runReadAcrossMockResponseForBpaAndTenNeighbors, {
  method: 'POST',
  handler: runReadAcrossResponse,
});
mockGenraEndpoint('DOWNLOAD', new Blob(), {
  method: 'POST',
  appendEndpoint: 'xlsx',
});

describe('Read Across Store', () => {
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(),
    revokeObjectURL: vi.fn(),
  });
  beforeEach(() => {
    setActivePinia(createPinia());
    const baseStore = useAppBaseStore();
    baseStore.params = GENRA_DEFAULT_PARAMS;
    baseStore.setupResponse = setupMockResponseForBpa;
    baseStore.currentStep = 1;
  });
  it('tests initial state', () => {
    const readAcrossStore = useReadAcrossStore();
    expect(readAcrossStore.readAcrossResponse).toBeFalsy();
    expect(readAcrossStore.runReadAcrossResponse).toBeFalsy();
    expect(readAcrossStore.isReadAcrossLoading).toBeFalsy();
    expect(readAcrossStore.showSelectionChangeDialog).toBeFalsy();
    expect(readAcrossStore.isReadAcrossPanelAvailable).toBeFalsy();
  });

  it('tests getting read across data', async() => {
    readAcrossResponse.mockImplementation(() => getReadAcrossMockResponseForBpaAndTenNeighbors);
    const baseStore = useAppBaseStore();
    const readAcrossStore = useReadAcrossStore();
    baseStore.currentStep = 2;
    expect(readAcrossStore.isReadAcrossPanelAvailable).toBeFalsy();
    await readAcrossStore.getReadAcrossData();
    expect(readAcrossStore.isReadAcrossPanelAvailable).toBeTruthy();
    expect(readAcrossStore.readAcrossResponse).toBeTruthy();

    // Test engine not available
    const noEngineParams = {
      ...getReadAcrossMockResponseForBpaAndTenNeighbors,
      predEngines: getReadAcrossMockResponseForBpaAndTenNeighbors.predEngines.map(engine => ({
        ...engine,
        data_exists: false,
      })),
    };
    readAcrossResponse.mockImplementation(() => noEngineParams);
    await readAcrossStore.getReadAcrossData();
    expect(baseStore.params.engine).toBeFalsy();
  });

  it('tests selecting a chemical', () => {
    const analogueToSelect = getReadAcrossMockResponseForBpaAndTenNeighbors.columns[2]?.field ?? 'test';

    // initiates selection dialog during rra
    const baseStore = useAppBaseStore();
    const readAcrossStore = useReadAcrossStore();
    readAcrossStore.readAcrossResponse = getReadAcrossMockResponseForBpaAndTenNeighbors;
    readAcrossStore.runReadAcrossResponse = runReadAcrossMockResponseForBpaAndTenNeighbors;
    baseStore.currentStep = 4;
    expect(readAcrossStore.showSelectionChangeDialog).toBeFalsy();
    readAcrossStore.selectChemicalHandler(analogueToSelect);
    expect(readAcrossStore.showSelectionChangeDialog).toBeTruthy();

    // clicks handler on step 3
    const isAnalogueToSelectChecked = getReadAcrossMockResponseForBpaAndTenNeighbors.columns
      .find(column => column.field === analogueToSelect)?.headerComponentParams?.isChecked;
    readAcrossStore.showSelectionChangeDialog = false;
    baseStore.currentStep = 3;
    readAcrossStore.selectChemicalHandler(analogueToSelect);
    const updatedCol = readAcrossStore.readAcrossResponse?.columns
      .find(column => column.field === analogueToSelect);
    if (updatedCol) {
      expect(updatedCol.headerComponentParams.isChecked).toBe(!isAnalogueToSelectChecked);
    }
  });

  it('tests run read across', async() => {
    // Normal Run
    runReadAcrossResponse.mockImplementation(() => runReadAcrossMockResponseForBpaAndTenNeighbors);
    const baseStore = useAppBaseStore();
    const readAcrossStore = useReadAcrossStore();
    readAcrossStore.readAcrossResponse = getReadAcrossMockResponseForBpaAndTenNeighbors;
    readAcrossStore.runReadAcrossResponse = runReadAcrossMockResponseForBpaAndTenNeighbors;
    baseStore.currentStep = 3;

    await readAcrossStore.runReadAcross({
      engine: 'genrapy',
      sortBy: 'test',
      sortOrder: 'asc',
      minMinus: 1,
      minPlus: 1,
      simWeight: false,
      paginate: false,
    });
    expect(baseStore.currentStep).toBe(4);

    // Tests error handler
    runReadAcrossResponse.mockImplementation(() => {
      throw new Error();
    });
    await readAcrossStore.runReadAcross({
      engine: 'genrapy',
      sortBy: 'test',
      sortOrder: 'asc',
      minMinus: 1,
      minPlus: 1,
      simWeight: false,
      paginate: false,
    });
    expect(baseStore.errorMsg).toBe(DEFAULT_RUN_RRA_ERR_MSG);
  });

  it('tests sim width handler', () => {
    const baseStore = useAppBaseStore();
    const readAcrossStore = useReadAcrossStore();
    readAcrossStore.readAcrossResponse = {...getReadAcrossMockResponseForBpaAndTenNeighbors};
    readAcrossStore.runReadAcrossResponse = {...runReadAcrossMockResponseForBpaAndTenNeighbors};
    baseStore.currentStep = 3;
    readAcrossStore.setSimilarityWidthHandler(true);
    expect(readAcrossStore.readAcrossResponse.data).not.toEqual(getReadAcrossMockResponseForBpaAndTenNeighbors.data);

    baseStore.currentStep = 4;
    readAcrossStore.setSimilarityWidthHandler(true);
    expect(readAcrossStore.runReadAcrossResponse.data).not.toEqual(runReadAcrossMockResponseForBpaAndTenNeighbors.data);
  });

  it('tests file download', async() => {
    const readAcrossStore = useReadAcrossStore();
    await readAcrossStore.readAcrossDownload('xlsx', '');
  });
});
