import type {BaseParams} from '~/api/types';
import type {Dtxsid} from '~~/types';

export interface ChemicalEntry {
  chem_id: string;
  dtxsid?: Dtxsid;
  searchWord?: string;
}

export interface Params extends BaseParams {
  flags?: Flag;
  fp_weight?: string;
}
