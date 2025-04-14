import {
  beforeEach, describe, expect, it,
  vi,
} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {useRadialStore} from './radial';
import {useAppBaseStore} from '#imports';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {mockGenraEndpoint} from '~/test/vitest/helpers';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import type {RadialViewResponseItem} from '~/api/types';
import type {HybridFpOption} from '~/components/radial/types';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';
import {assayMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/AssayMocks';
import {getReadAcrossMockResponseForBpaAndTenNeighbors, runReadAcrossMockChemIncForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/ReadAcrossMocks';

const radialResponse = vi.fn();

mockGenraEndpoint('RADIAL', radialMockResponseForBpaAndTenNeighbors, {handler: radialResponse});
mockGenraEndpoint('FINGERPRINT', fingerprintMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('ASSAY', assayMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('GET_READACROSS', getReadAcrossMockResponseForBpaAndTenNeighbors);
mockGenraEndpoint('RUN_READACROSS', runReadAcrossMockChemIncForBpaAndTenNeighbors);

describe('Radial Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const baseStore = useAppBaseStore();
    baseStore.params = GENRA_DEFAULT_PARAMS;
    baseStore.setupResponse = setupMockResponseForBpa;
    baseStore.currentStep = 1;
  });

  it('tests initial state', () => {
    radialResponse.mockImplementation(() => radialMockResponseForBpaAndTenNeighbors);
    const radialStore = useRadialStore();
    expect(Object.keys(radialStore.radialResponse).length).toBeFalsy();
    expect(radialStore.graphResponse).toBeFalsy();
    expect(radialStore.physchemPlotUrl).toBeFalsy();
    expect(radialStore.isRadialPanelLoading).toBeFalsy();
    expect(radialStore.neighborByOptions).toStrictEqual(setupMockResponseForBpa.neighbor_by);
    expect(radialStore.filterByOptions).toStrictEqual(setupMockResponseForBpa.filter_by);
  });

  it('tests Neighbor By change handler', async() => {
    const radialStore = useRadialStore();
    const baseStore = useAppBaseStore();

    baseStore.params = GENRA_DEFAULT_PARAMS;
    baseStore.setupResponse = {
      ...setupMockResponseForBpa,
      filter_by: setupMockResponseForBpa.filter_by.slice(1),
    };
    baseStore.currentStep = 1;
    const neighborBy = setupMockResponseForBpa.neighbor_by[1]?.key ?? '';
    radialResponse.mockImplementation(() => ({
      ...radialMockResponseForBpaAndTenNeighbors,
    }));
    await radialStore.neighborByChangeHandler(neighborBy);
    expect(baseStore.params.fp).toBe(neighborBy);
  });

  it('tests Filter By change handler', async() => {
    const radialStore = useRadialStore();
    const baseStore = useAppBaseStore();

    const filterBy = setupMockResponseForBpa.filter_by[1]?.key ?? '';
    radialResponse.mockImplementation(() => ({
      ...radialMockResponseForBpaAndTenNeighbors,
      sel_by: filterBy,
    }));
    await radialStore.filterByChangeHandler(filterBy);
    expect(baseStore.params.sel_by).toBe(filterBy);
  });

  it('tests Number of Analogues change hander', async() => {
    const radialStore = useRadialStore();
    const baseStore = useAppBaseStore();

    const numOfAnalogues = 11;
    radialResponse.mockImplementation(() => ({
      ...radialMockResponseForBpaAndTenNeighbors,

      result: radialMockResponseForBpaAndTenNeighbors.result
        .concat(radialMockResponseForBpaAndTenNeighbors.result[0] as RadialViewResponseItem),
    }));
    await radialStore.numOfAnaloguesChangeHandler(0);
    await radialStore.numOfAnaloguesChangeHandler(numOfAnalogues);
    expect(baseStore.params.k0).toBe(numOfAnalogues);
  });

  it('tests Hyrbid FP Change Hander', async() => {
    const radialStore = useRadialStore();
    const baseStore = useAppBaseStore();
    const mockHybridOptions: HybridFpOption[] = [
      {
        weight: 2,
        data_exists: true,
        description: 'test desc',
        key: 'test1,test2',
        name: 'test',
      },
      {
        weight: 3,
        data_exists: true,
        description: 'test2 desc',
        key: 'test1,test2,test3',
        name: 'test2',
      },
    ];
    await radialStore.hybridFpChangeHandler(mockHybridOptions);
    expect(baseStore.params.fp).toBe(mockHybridOptions.map(({key}) => key).join(','));
    expect(baseStore.params.fp_weight).toBe(mockHybridOptions.map(({weight}) => weight.toString()).join(','));
  });

  it('tests weight, flags, and edge cases', async() => {
    const baseStore = useAppBaseStore();
    baseStore.currentStep = 0;
    baseStore.params.fp_weight = '1,2,3';
    baseStore.setupResponse.graph_type = [];
    radialResponse.mockImplementation(() => ({
      ...radialMockResponseForBpaAndTenNeighbors,
      report_db: [],
      flags: 'usernn',
    }));

    await baseStore.getGenraData();
  });

  it('tests starting GenRA from NE', async() => {
    const radialStore = useRadialStore();
    const baseStore = useAppBaseStore();
    baseStore.currentStep = 2;
    await radialStore.startGenraFromNe({
      chemId: 'testId',
      fromCustomNn: true,
    });
    expect(baseStore.currentStep).toBe(1);
    expect(baseStore.params.flags).toBe('usernn');

    baseStore.currentStep = 1;
    baseStore.params.flags = 'multitarget';
    await radialStore.startGenraFromNe({
      chemId: 'testId',
      fromCustomNn: false,
    });
    expect(baseStore.currentStep).toBe(1);
    expect(baseStore.params.flags).toBe('multitarget');
  });
});
