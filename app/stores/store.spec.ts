import {
  beforeEach, describe, expect, it,
  vi,
} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {mockVersion, setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {mockGenraEndpoint} from '~/test/vitest/helpers';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';
import {assayMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/AssayMocks';
import {getReadAcrossMockResponseForBpaAndTenNeighbors, runReadAcrossMockChemIncForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/ReadAcrossMocks';

mockGenraEndpoint('VERSION', mockVersion);

const setupResponse = vi.fn();

const radialResponse = vi.fn();

mockGenraEndpoint('RADIAL', radialMockResponseForBpaAndTenNeighbors, {handler: radialResponse});
mockGenraEndpoint('FINGERPRINT', fingerprintMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('ASSAY', assayMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('SETUP', setupMockResponseForBpa, {handler: setupResponse});
mockGenraEndpoint('GET_READACROSS', getReadAcrossMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('RUN_READACROSS', runReadAcrossMockChemIncForBpaAndTenNeighbors);

describe('Base Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('tests initial state', () => {
    const baseStore = useAppBaseStore();
    expect(baseStore.currentStep).toBe(0);
    expect(baseStore.showEpaHeaderAndFooter).toBe(true);
    expect(baseStore.params).toStrictEqual(GENRA_DEFAULT_PARAMS);
    expect(baseStore.isMultiTarget).toBe(false);
    expect(baseStore.isCustomNn).toBe(false);
  });

  it('tests setting step', () => {
    const baseStore = useAppBaseStore();
    expect(baseStore.currentStep).toBe(0);
    baseStore.setStep(1);
    expect(baseStore.currentStep).toBe(1);
    baseStore.setStep(99);
    expect(baseStore.currentStep).toBe(1);
    baseStore.errorMsg = 'test error msg';

    // Setting to 0 triggers reset
    baseStore.setStep(0);
    expect(baseStore.currentStep).toBe(0);
    expect(baseStore.errorMsg).toBe('');
  });

  it('tests search from multitarget', () => {
    const baseStore = useAppBaseStore();
    setupResponse.mockImplementation(() => setupMockResponseForBpa);
    radialResponse.mockImplementation(() => radialMockResponseForBpaAndTenNeighbors);
    baseStore.searchFromMultiTarget({
      chem_id: setupMockResponseForBpa.chem_id,
    }, false);
    expect(baseStore.params.flags).toBe('usernn');
    expect(baseStore.params.chem_id).toBe(setupMockResponseForBpa.chem_id);
    expect(baseStore.isCustomNn).toBe(true);

    baseStore.searchFromMultiTarget({
      chem_id: setupMockResponseForBpa.chem_id,
    }, true);
    expect(baseStore.params.flags).toBe('multitarget');
    expect(baseStore.params.chem_id).toBe(setupMockResponseForBpa.chem_id);
    expect(baseStore.isMultiTarget).toBe(true);
  });

  it('tests searching without flags', async() => {
    const baseStore = useAppBaseStore();
    setupResponse.mockImplementation(() => setupMockResponseForBpa);
    radialResponse.mockImplementation(() => radialMockResponseForBpaAndTenNeighbors);
    await baseStore.searchWithoutFlags('BPA');
    expect(baseStore.params?.flags).toBeFalsy();
    expect(baseStore.isMultiTarget).toBe(false);
    expect(baseStore.isCustomNn).toBe(false);
  });

  it('tests errors and edge cases', async() => {
    const baseStore = useAppBaseStore();
    const testErrorMsg = 'test error msg';
    setupResponse.mockImplementation(() => ({
      ...setupMockResponseForBpa,
      error_msg: testErrorMsg,
    }));
    radialResponse.mockImplementationOnce(() => radialMockResponseForBpaAndTenNeighbors);

    await baseStore.setChemical({
      chem_id: setupMockResponseForBpa.chem_id,
    });
    expect(baseStore.errorMsg).toBe(testErrorMsg);

    await baseStore.setChemical({
      chem_id: '',
    });
    expect(baseStore.errorMsg).toBe(GENERIC_CHEMICAL_ERROR_ENTRY_MSG);
  });
});
