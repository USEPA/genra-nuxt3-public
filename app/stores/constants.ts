export const steps = [
  'Step One: Select a Chemical',
  'Step Two: Analog Identification and Evaluation',
  'Step Three: Data Gap Analysis & Generate Data Matrix',
  'Step Four: Run GenRA Prediction',
  'Step Five: Filter by Endpoint or Analogs',
] as const;

export type GenraStep = typeof steps[number];

export const GENRA_DEFAULT_PARAMS = {
  fp: 'chm_mrgn',
  k0: 10,
  sel_by: 'tox_txrf',
  chem_id: '',
  summarise: 'tox_txrf',
  sumrs_by: 'tox_fp',
  s0: 0.1,
  neg0: 1,
  steps: 3,
  pos0: 1,
  engine: 'genrapred',
};

export const GENERIC_CHEMICAL_ERROR_ENTRY_MSG = 'Invalid chemical input. Please try again.';

export type Flag = 'usernn' | 'multitarget';
