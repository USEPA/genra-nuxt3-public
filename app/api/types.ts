/**
 * Contains all response and request objects from GenRA API.
 */

import type {ColDef} from 'ag-grid-community';
import type {HelpKey} from '~/components/ui/Help/constants';
import type {
  ColorStr, Dtxcid, Dtxsid,
} from '~~/types';

export interface BaseItem {
  data_exists: boolean;
  description: string;
  key: string;
  name: string;
}

export interface BaseChemical {
  casrn: string;
  name: string;
  smiles: string;
  dsstox_cid: Dtxcid;
  dsstox_sid: Dtxsid;
  chem_id: string;
}

export interface BaseParams {
  fp: string;
  k0: number;
  sel_by: string;
  chem_id: string;
  summarise: string;
  sumrs_by: string;
  s0: number;
  neg0: number;
  steps: number;
  pos0: number;
  engine: string | null;
}

// Radial
export interface RadialViewResponseItem extends Pick<BaseChemical, 'name' | 'chem_id'> {
  selected: boolean;
  dtxsid: Dtxsid;
  dtxcid: Dtxcid;
  weight: number;
  value: number;
  similarity_tag: string;
  details_link: string;
}

export interface RadialViewReportDbResponseItem extends BaseItem {
  subFields: BaseItem[];
}

export interface RadialRequestParams extends Pick<BaseParams, 'k0' | 's0' | 'fp' | 'sel_by' | 'summarise' | 'sumrs_by' | 'chem_id'> {
  fp_weight?: string;
  flags?: Flag;
}

export interface RadialViewResponse {
  report_db: RadialViewReportDbResponseItem[];
  sel_by: string;
  result: RadialViewResponseItem[];
  flags?: Flag;
}

// Neighborhood explorer
export interface NeighborhoodGraphEdge {
  from: Dtxcid | Dtxsid;
  to: Dtxcid | Dtxsid;
  step: number;
  type: string;
  similarity: number;
}

export interface BaseGraphNode {
  expanded: boolean;
  mol_weight: number;
  isTarget?: boolean;
}

export interface NeighborhoodGraphNode {
  [key: Dtxcid | Dtxsid]: BaseGraphNode & Pick<BaseChemical, 'name' | 'dsstox_cid' | 'dsstox_sid'>;
}

export interface NeighborhoodGraphRequestParams extends BaseParams {
  graph_type: string;
}

export interface NeighborhoodGraphResponse {
  edges: NeighborhoodGraphEdge[];
  nodes: NeighborhoodGraphNode;
}

// Setup
export interface SetupDownloadItem extends Omit<BaseItem, 'key'> {
  rel: string;
  subdir: string | null;
}

interface HelpTextItem {
  helpPosition: string;
  helpText: string;
  helpTextId: HelpKey;
  iconType: string;
}

export type SetupParams = Pick<RadialRequestParams, 'chem_id' | 'flags'>;

export interface SetupFilterBy extends Omit<BaseItem, 'key'> {
  aggregator?: string;
  skip?: boolean;
  key?: string;
}

export interface SetupResponse extends BaseChemical {
  download: SetupDownloadItem[];
  filter_by: SetupFilterBy[];
  fpColor: {
    [key: string]: ColorStr;
  };
  fp_needs_gen: string[];
  graph_type: BaseItem[];
  help_text: HelpTextItem[];
  hybrid_fp_max: number;
  initGraphFPs: string[];
  is_markush: boolean;
  mol_weight: number;
  neighbor_by: BaseItem[];
  error_msg?: string;
  flags?: Flag;
}

// Search
export interface SearchResponseItem extends Omit<BaseChemical, 'dsstox_cid' | 'smiles'> {
  dsstox_cid: string | null;
  smiles: string | null;
}

export interface SearchResponse {
  hits: SearchResponseItem[];
}

// Fingerprint Heat Chart
export interface FingerprintBaseItem {
  value: number;
  scaled: number;
}

export interface FingerprintData extends Pick<BaseChemical, 'chem_id' | 'name'>, Pick<RadialViewResponseItem, 'dtxcid' | 'dtxsid' | 'details_link'> {
  bio_pest: FingerprintBaseItem;
  bio_txct: FingerprintBaseItem;
  bio_txct_ATG: FingerprintBaseItem;
  bio_txct_BSK: FingerprintBaseItem;
  bio_txct_NVS: FingerprintBaseItem;
  chm_aim: FingerprintBaseItem;
  chm_ct: FingerprintBaseItem;
  chm_httr: FingerprintBaseItem;
  chm_mrgn: FingerprintBaseItem;
  chm_pfas: FingerprintBaseItem;
  chm_phch: FingerprintBaseItem;
  tox_txrf: FingerprintBaseItem;
}

export interface FingerprintHeatChartResponse {
  data: FingerprintData[];
  columns: ColDef[];
  flags?: Flag;
}

// Assay Panel
export interface AssayDataItem {
  ep_name: string;
  ep_tip: string;
  [key: Dtxcid | Dtxsid]: number | string;
}

export interface AssayResponse {
  data: AssayDataItem[];
  columns: ColDef[];
  flags?: Flag;
}

// Read Across Panel
export interface ReadAcrossCellItem {
  cellRenderer: string;
  isChecked: boolean;
  isPrediction: boolean;
  similarity: number;
  useWidth: boolean;
  value: string | number;
  pval?: number;

}

export interface ReadAcrossContinuousCellItem extends ReadAcrossCellItem {
  continuousData: boolean;
  confMin: null | number;
  confMax: null | number;
  rangeMin: number;
  rangeMax: number;
  estimate: number | null;
  observation?: number;
  obs_disp: string;
  est_disp?: string;
  dir: string;
}

export interface ReadAcrossItem extends Pick<AssayDataItem, 'ep_name' | 'ep_tip'> {
  negObs?: number;
  posObs?: number;
  allObs?: number;
  alphaName?: number;
  isPhysProp?: boolean;
  physchem?: string;
  predClass?: number;
  ACT?: number;
  AUCpval?: number;
  [key: Dtxcid | Dtxsid]: ReadAcrossCellItem | ReadAcrossContinuousCellItem | string | Pick<ReadAcrossCellItem, 'value' | 'cellRenderer'>;
}

export interface ReadAcrossParams extends Omit<RadialRequestParams, 'flags' | 'fp_weight'>, Pick<BaseParams, 'engine' | 'pos0' | 'neg0'> {
  useWidth: boolean;
  chem_inc: {
    isChecked: boolean; chem_id: string;
  }[];
}

export interface ReadAcrossColumnHeaderComponentParams extends Pick<ReadAcrossCellItem, 'isChecked' | 'useWidth' | 'similarity'>,
  Pick<BaseChemical, 'name' | 'chem_id'> {
  targetChem: boolean;
}

export interface ReadAcrossResponse {
  columns: ColDef<ReadAcrossItem> [];
  data: ReadAcrossItem[];
  predEngines: BaseItem[];
  sortOptions: BaseItem[];
}

export type RunReadAcrossResponse = Omit<ReadAcrossResponse, 'predEngines'>;

// Download
export interface DownloadParams extends BaseParams {
  subdir: string;
  chem_inc?: {
    isChecked: boolean; chem_id: string;
  }[];
  rra?: boolean;
  filter?: string;
}
