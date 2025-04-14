import {
  describe, it, expect, expectTypeOf, vi,
  beforeEach,
} from 'vitest';
import GenraRepository from './GenraRepository';
import {mockGenraEndpoint} from '~/test/vitest/helpers';
import {radialMockResponseForBpaAndTenNeighbors, radialRequestParamsForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {nExplorerResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/NeighborhoodExplorerMocks';
import {basicRequestParamsForBpaAndTenNeighbor} from '~/test/vitest/mockData/api/ParamsMocks';
import {searchMockResponseForBPA} from '~/test/vitest/mockData/api/ChemicalSearchMocks';
import {fingerprintMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/FingerprintMocks';
import {assayMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/AssayMocks';
import {
  getReadAcrossMockResponseForBpaAndTenNeighbors,
  runReadAcrossMockResponseForBpaAndTenNeighbors,
  runReadAcrossMockChemIncForBpaAndTenNeighbors,
} from '~/test/vitest/mockData/api/ReadAcrossMocks';

const genraRepo = new GenraRepository();

const plotResponse = vi.fn();
mockGenraEndpoint('PHYSCHEM_PLOT', 'testReturn', {handler: plotResponse});
describe('Genra Repository Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks(); // prevents any subsequent' test mock conflict
  });
  it('returns version text', async() => {
    mockGenraEndpoint('VERSION', '3.3.1');
    const versionText = await genraRepo.getVersion();
    expect(versionText).toBeTruthy();
    expectTypeOf(versionText).toBeString();
  });

  it('returns radial neighbors with 10 neighbors', async() => {
    mockGenraEndpoint('RADIAL', radialMockResponseForBpaAndTenNeighbors);
    const neighbors = await genraRepo.getNeighbors(radialRequestParamsForBpaAndTenNeighbors);
    expect(neighbors).toBeTruthy();
    expect(neighbors.result).toHaveLength(11);
  });

  it('returns setup', async() => {
    mockGenraEndpoint('SETUP', setupMockResponseForBpa);
    const bpaDtxcid = 'DTXCID30182';
    const setup = await genraRepo.getSetup({chem_id: bpaDtxcid});
    expect(setup).toBeTruthy();
    expect(setup.dsstox_cid).toEqual(bpaDtxcid);
  });

  it('returns NE Explorer data', async() => {
    mockGenraEndpoint('NEXPLORER', nExplorerResponseForBpaAndTenNeighbors);
    const nExplorer = await genraRepo.getNeighborhoodGraph({
      ...basicRequestParamsForBpaAndTenNeighbor,
      graph_type: 'all_nhbrs',
    });
    expect(nExplorer).toBeTruthy();
  });

  it('returns search results', async() => {
    mockGenraEndpoint('SEARCH', searchMockResponseForBPA);
    const search = await genraRepo.chemicalSearch('BPA');
    expect(search).toBeTruthy();
  });

  it('returns physchem plot', async() => {
    plotResponse.mockImplementation(() => 'testReturn');
    const plot = await genraRepo.getPhyschemPlot({
      ...basicRequestParamsForBpaAndTenNeighbor,
    });
    expect(plot).toBeTruthy();
  });

  it('returns empty string for plot error', async() => {
    plotResponse.mockImplementation(() => ({error: true}));
    const plot = await genraRepo.getPhyschemPlot({
      ...basicRequestParamsForBpaAndTenNeighbor,
    });
    expect(plot).toBeFalsy();
  });

  it('returns empty string for plot catch error', async() => {
    plotResponse.mockImplementation(() => new Error('error'));
    const plot = await genraRepo.getPhyschemPlot({
      ...basicRequestParamsForBpaAndTenNeighbor,
    });
    expect(plot).toBeFalsy();
  });

  it('returns fingerprint results', async() => {
    mockGenraEndpoint('FINGERPRINT', fingerprintMockResponseForBpaAndTenNeighbors);
    const fp = await genraRepo.getFingerprintGrid({
      ...basicRequestParamsForBpaAndTenNeighbor,
    });
    expect(fp).toBeTruthy();
  });

  it('returns assay results', async() => {
    mockGenraEndpoint('ASSAY', assayMockResponseForBpaAndTenNeighbors);
    const assays = await genraRepo.getAssayGrid({
      ...basicRequestParamsForBpaAndTenNeighbor,
    });
    expect(assays).toBeTruthy();
  });

  it('returns read across results', async() => {
    mockGenraEndpoint('GET_READACROSS', getReadAcrossMockResponseForBpaAndTenNeighbors);
    const readAcross = await genraRepo.getReadAcrossGrid(basicRequestParamsForBpaAndTenNeighbor);
    expect(readAcross).toBeTruthy();
  });

  it('returns run read across results', async() => {
    mockGenraEndpoint('RUN_READACROSS', runReadAcrossMockResponseForBpaAndTenNeighbors, {
      method: 'POST',
    });
    const readAcross = await genraRepo.getReadAcrossPredictions({
      ...basicRequestParamsForBpaAndTenNeighbor,
      useWidth: true,
      chem_inc: runReadAcrossMockChemIncForBpaAndTenNeighbors,
    });
    expect(readAcross).toBeTruthy();
  });

  it('returns download result', async() => {
    mockGenraEndpoint('DOWNLOAD', new Blob(), {
      method: 'POST',
      appendEndpoint: 'RAview',
    });
    const file = await genraRepo.genraDownload({
      ...basicRequestParamsForBpaAndTenNeighbor,
      subdir: 'RAview',
    });

    expect(file).toBeTruthy();
  });
});
