export type SortOrder = 'asc' | 'desc';

export type ValueOfForm = number | string | undefined | boolean | null;

export interface RunReadAcrossForm {
  engine: string | null;
  sortBy: string | undefined;
  sortOrder: SortOrder;
  minMinus: number;
  minPlus: number;
  simWeight: boolean;
  paginate: boolean;
}

export interface UpdateRunReadAcrossFormParams {
  key: keyof RunReadAcrossForm;
  value: ValueOfForm;
  fromCancelSelectionDialog?: boolean;
}
