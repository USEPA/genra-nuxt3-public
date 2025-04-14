import {cacheBust, GenraEndpoints} from './helpers';
import Repository from './Repository';
import type {
  AssayResponse,
  BaseParams,
  DownloadParams,
  FingerprintHeatChartResponse,
  NeighborhoodGraphRequestParams,
  NeighborhoodGraphResponse,
  RadialRequestParams,
  RadialViewResponse,
  ReadAcrossParams,
  RunReadAcrossResponse,
  ReadAcrossResponse,
  SearchResponse,
  SetupParams,
  SetupResponse,
} from './types';

export default class GenraRepository {
  readonly #repo: Repository;

  constructor() {
    const {APPLICATION_GENRA_API_BASE: baseURL} = useRuntimeConfig().public;

    this.#repo = new Repository({baseURL});
  }

  /**
   * Radial response which contains data for radial panel & the dropdowns for the assay panel.
   * @param params
   * @returns RadialViewResponse
   */
  async getNeighbors(params: RadialRequestParams) {
    const neighbors = await this.#repo.fetch<RadialViewResponse>(GenraEndpoints.RADIAL, {
      params,
    });
    return neighbors;
  }

  /**
   * UI Setup API call which will facilitate configuration(s) for dropdowns, colormaps, fingerprints, ect.
   * @param params
   * @returns SetupResponse
   */
  async getSetup(params: SetupParams) {
    const setup = await this.#repo.fetch<SetupResponse>(GenraEndpoints.SETUP, {
      params,
    });
    return setup;
  }

  /**
   * Neighborhood explorer data which builds the interactive neighborhood explorer graph.
   * @param params
   * @returns NeighborhoodGraphResponse
   */
  async getNeighborhoodGraph(params: NeighborhoodGraphRequestParams) {
    const graphData = await this.#repo.fetch<NeighborhoodGraphResponse>(GenraEndpoints.NEXPLORER, {
      params,
    });
    return graphData;
  }

  /**
 * Chemical search hits.
 * @param params
 * @returns SearchResponse
 */
  async chemicalSearch(params: string) {
    const searchResults = await this.#repo.fetch<SearchResponse>(GenraEndpoints.SEARCH, {
      params: {
        txt: params,
      },
    });

    return searchResults;
  }

  /**
   * Used for phychem plot on radial panel.
   * @param params
   * @returns url string
   */
  async getPhyschemPlot(params: Pick<BaseParams, 'chem_id' | 'k0' | 's0' | 'fp' | 'sel_by'>) {
    try {
      const plotData = await this.#repo.fetch<string | {
        error: boolean;
      }>(GenraEndpoints.PHYSCHEM_PLOT, {
        params: {
          ...params,
          ftype: 'html',
        },
      });

      if (typeof plotData === 'object' && plotData.error) {
        return '';
      }

      return plotData as string;
    } catch {
      return '';
    }
  }

  /**
   * Current GenRA version.
   * @returns version string
   */
  async getVersion() {
    const version = await this.#repo.fetch<string>(`${GenraEndpoints.VERSION}`);
    return version;
  }

  /**
  * Column definitions and data for Fingerprint heat panel (2nd panel in GenRA workflow).
  * @param params
  * @returns FingerprintHeatChartResponse
  */
  async getFingerprintGrid(params: Omit<RadialRequestParams, 'summarise' | 'sumrs_by'>) {
    const hearGrid = await this.#repo.fetch<FingerprintHeatChartResponse>(GenraEndpoints.FINGERPRINT, {params});
    return hearGrid;
  }

  /**
   * Column definitions and data for Assay panel (3rd panel in GenRA workflow).
   * @param params
   * @returns AssayResponse
   */
  async getAssayGrid(params: RadialRequestParams) {
    const assayGrid = await this.#repo.fetch<AssayResponse>(GenraEndpoints.ASSAY, {params});
    return assayGrid;
  }

  /**
   * Column definitions and data for Read Across panel (4th(final) panel in GenRA workflow).
   * @param params
   * @returns ReadAcrossResponse
   */
  async getReadAcrossGrid(params: RadialRequestParams) {
    const readAcrossGrid = await this.#repo.fetch<ReadAcrossResponse>(GenraEndpoints.GET_READACROSS, {params});
    return readAcrossGrid;
  }

  /**
   * Column definitions and data when predictions are run for Read Across panel (4th(final) panel in GenRA workflow).
   * @param params
   * @returns Omit<ReadAcrossResponse, 'predEngines'>
   */
  async getReadAcrossPredictions(params: ReadAcrossParams) {
    const predictions = await this.#repo.fetch<RunReadAcrossResponse>(`${GenraEndpoints.RUN_READACROSS}?${cacheBust()}`, {
      method: 'POST',
      body: params,
    });
    return predictions;
  }

  /**
   * File download for Radial and Read Across panels.
   * @param params
   * @returns blob
   */
  async genraDownload(params: DownloadParams) {
    const {subdir, ...restParams} = params;
    const file = await this.#repo.fetch.raw<Blob>(`${GenraEndpoints.DOWNLOAD}${subdir}?${cacheBust()}`, {
      responseType: 'blob',
      method: 'POST',
      // headers: {
      //   Accept: 'image/png',
      // },
      body: restParams,
    });
    return file;
  }
}
