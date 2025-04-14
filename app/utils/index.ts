import type {GridApi} from 'ag-grid-community';

export const getFileNameFromHeaders = (headers: Headers) => {
  return headers.get('content-disposition')?.split('=').pop()?.trim() ?? '';
};

export const getSvgImgUrl = (chemId: string) => {
  const {APPLICATION_GENRA_API_BASE: baseUrl} = useRuntimeConfig().public;
  return `${baseUrl}/api/genra/v3/viewChem/${encodeURIComponent(chemId)}.svg`;
};

export const getDateTimeForNeExport = () => {
  return useDateFormat(new Date(), 'MM_YYYY_DD_HHmmss');
};
export const getStrWithEllipsis = (str: string, maxLength: number) => str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;

export class GenraApiError extends Error {
  genraErrorMsg: string;

  constructor(message: string, genraErrorMsg: string) {
    super();
    this.message = message;
    this.genraErrorMsg = genraErrorMsg;
  }
}

export const getErrorMsg = (err: unknown) => err instanceof GenraApiError && err.genraErrorMsg ?
  err.genraErrorMsg :
  'Error retrieving available fingerprint information for selected chemical. Please try again.';

export const resizeGrid = (api: GridApi | undefined) => {
  if (api) {
    api.sizeColumnsToFit();
  }
};
