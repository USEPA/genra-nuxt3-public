import type {BaseParams} from '~/api/types';
import {DEFAULT_GRAPH_NEIGHBORS} from '~/components/radial/NeighborhoodExplorer/Graph/constants';

export const basicRequestParamsForBpaAndTenNeighbor: BaseParams = {
  fp: 'chm_mrgn,bio_txct',
  k0: DEFAULT_GRAPH_NEIGHBORS,
  sel_by: 'tox_txrf',
  chem_id: 'DTXCID30182',
  summarise: 'tox_txrf',
  sumrs_by: 'tox_fp',
  s0: 0.1,
  neg0: 1,
  steps: 3,
  pos0: 1,
  engine: 'genrapred',
};
