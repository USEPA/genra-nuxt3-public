import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {useRadialStore} from '../radial/radial';
import {useAssayStore} from './assay';
import {mockGenraEndpoint} from '~/test/vitest/helpers';
import {assayMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/AssayMocks';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';
import {mockVersion, setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import {getReadAcrossMockResponseForBpaAndTenNeighbors, runReadAcrossMockChemIncForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/ReadAcrossMocks';

const assayResponse = vi.fn();

mockGenraEndpoint('FINGERPRINT', fingerprintMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('ASSAY', assayMockResponseForBpaAndTenNeighbors, {handler: assayResponse});
mockGenraEndpoint('SETUP', setupMockResponseForBpa);
mockGenraEndpoint('VERSION', mockVersion);
mockGenraEndpoint('RADIAL', radialMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('GET_READACROSS', getReadAcrossMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('RUN_READACROSS', runReadAcrossMockChemIncForBpaAndTenNeighbors);

describe('Assay Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const baseStore = useAppBaseStore();
    baseStore.params = GENRA_DEFAULT_PARAMS;
    baseStore.setupResponse = setupMockResponseForBpa;
    baseStore.currentStep = 2;
  });

  it('tests initial state', () => {
    assayResponse.mockImplementation(() => assayMockResponseForBpaAndTenNeighbors);
    const assayStore = useAssayStore();
    expect(assayStore.isAssayLoading).toBeFalsy();
    expect(assayStore.assayResponse).toBeFalsy();
  });

  it('tests get assay data', async() => {
    assayResponse.mockImplementation(() => assayMockResponseForBpaAndTenNeighbors);
    const assayStore = useAssayStore();
    expect(assayStore.isAssayLoading).toBeFalsy();
    expect(assayStore.assayResponse).toBeFalsy();
    await assayStore.getAssayData();
    expect(assayStore.isAssayLoading).toBeFalsy();
    expect(assayStore.assayResponse).toBeTruthy();
  });

  it('tests assay assigns flags', async() => {
    const responseWithFlags = assayMockResponseForBpaAndTenNeighbors;
    responseWithFlags.flags = 'multitarget';
    assayResponse.mockImplementation(() => responseWithFlags);
    const baseStore = useAppBaseStore();
    const assayStore = useAssayStore();
    expect(baseStore.params.flags).toBeFalsy();

    await assayStore.getAssayData();
    expect(baseStore.params.flags).toBeTruthy();
  });

  it('tests assay group dropdown', async() => {
    assayResponse.mockImplementation(() => assayMockResponseForBpaAndTenNeighbors);
    const assayStore = useAssayStore();
    const baseStore = useAppBaseStore();
    const radialStore = useRadialStore();
    radialStore.radialResponse = radialMockResponseForBpaAndTenNeighbors;
    expect(baseStore.params).toStrictEqual(GENRA_DEFAULT_PARAMS);

    await assayStore.assayDropdownChangeHandler('bio_txct');

    expect(baseStore.params.summarise).toBe('bio_txct');
    const subField = radialMockResponseForBpaAndTenNeighbors.report_db.find(({key}) => key === 'bio_txct')
      ?.subFields.find(({data_exists: dataExists}) => !!dataExists)?.key;
    expect(baseStore.params.sumrs_by).toBe(subField);
  });

  it('tests assay by dropdown', async() => {
    assayResponse.mockImplementation(() => assayMockResponseForBpaAndTenNeighbors);
    const assayStore = useAssayStore();
    const baseStore = useAppBaseStore();
    baseStore.currentStep = 4;
    const radialStore = useRadialStore();
    radialStore.radialResponse = radialMockResponseForBpaAndTenNeighbors;
    expect(baseStore.params).toStrictEqual(GENRA_DEFAULT_PARAMS);
    await assayStore.assayDropdownChangeHandler('test', false);
    expect(baseStore.params.sumrs_by).toBe('test');
  });
});
