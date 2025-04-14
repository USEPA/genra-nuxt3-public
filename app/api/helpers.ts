export const cacheBust = () => Date.now().toString(36);

export const GenraEndpoints = {
  RADIAL: '/api/genra/v4/uiRadialView/',
  SETUP: '/api/genra/v4/uiSetup/',
  NEXPLORER: '/api/genra/v4/uiFastNN/',
  SEARCH: '/api/genra/v3/searchChems/',
  PHYSCHEM_PLOT: '/api/genra/v4/uiPhyschemPlot/',
  VERSION: '/version.txt',
  FINGERPRINT: '/api/genra/v4/uiFingerPrintHeatChart/',
  ASSAY: '/api/genra/v4/uiAssayList/',
  GET_READACROSS: '/api/genra/v4/uiGenerateReadAcross/',
  RUN_READACROSS: '/api/genra/v4/uiRunReadAcross',
  DOWNLOAD: '/api/genra/v4/uiDownload',
} as const;

export type GenraEndpoint = keyof typeof GenraEndpoints;
