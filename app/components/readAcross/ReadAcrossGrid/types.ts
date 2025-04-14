import type {BaseChemical, ReadAcrossCellItem} from '~/api/types';

export interface ReadAcrossHeaderComponentParams extends Pick<ReadAcrossCellItem, 'isChecked' | 'useWidth' | 'similarity'>, Pick<BaseChemical, 'name' | 'chem_id'> {
  targetChem: boolean;
}

export interface RedBlueTooltipParams extends Pick<ReadAcrossCellItem, 'isChecked' | 'useWidth' | 'similarity'> {
  isPrediction: boolean;
  value: string;
}
