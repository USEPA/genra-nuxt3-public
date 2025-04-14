export const HelpTextKey = {
  RADIAL: 'GENRA Analog Identification',
  FINGERPRINT: 'GENRA Summary Data Gap Analysis',
  ASSAY: 'GENRA Generate Data Matrix',
  READACROSS: 'GENRA Run GenRA Prediction',
} as const;

export type HelpKey = typeof HelpTextKey[keyof typeof HelpTextKey];
