import type {FingerprintHeatChartResponse} from '~/api/types';

export const fingerprintMockResponseForBpaAndTenNeighbors: FingerprintHeatChartResponse = {
  columns: [
    {
      headerName: 'Chemical',
      headerTooltip: 'Target chemical and neighbors, click ☰ then ⦀ to show more data streams.',
      field: 'name',
      tooltipField: 'name',
      cellRenderer: 'GenraChemicalLink',
      cellRendererParams: {
        useField: 'name',
      },
      suppressMenu: false,
      lockPosition: 'left',
      filter: false,
      minWidth: 45,
    },
    {
      headerName: 'bio_pest',
      headerTooltip: 'MOA/classification information taken from Resistance Action Committees for fungicides, insecticides and herbicides',
      field: 'bio_pest',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: true,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'bio_txct',
      headerTooltip: 'ToxCast fingerprints are a non-directional fingerprint representation of assay hit calls represented by the assay component name of the associated platform.  Hit calls are taken from Level 5 of the associated invitrodb. This fingerprint collection comprises both ToxCast and Tox21 assay outcomes.',
      field: 'bio_txct',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: false,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'bio_txct_ATG',
      headerTooltip: 'This ToxCast ATG FP is a subset based on assays from the Attagene vendor.',
      field: 'bio_txct_ATG',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: true,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'bio_txct_BSK',
      headerTooltip: 'This ToxCast BSK FP is a subset based on assays from the BioSeek vendor.',
      field: 'bio_txct_BSK',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: true,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'bio_txct_NVS',
      headerTooltip: 'This ToxCast NVS FP is a subset based on assays from the NovaScreen vendor.',
      field: 'bio_txct_NVS',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: true,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'chm_aim',
      headerTooltip: 'AIM fingerprints are a reimplementation of the EPA Analog Identification Methodology (AIM) features.',
      field: 'chm_aim',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: true,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'chm_ct',
      headerTooltip: 'ToxPrint Chemotypes are a fixed set of structural features targeted to cover chemical structures from the large toxicity databases and regulatory inventories (Yang et al 2015). Chemotypes use CSRML (chemical substructure and reaction mark-up) language to represent atom-bond connectivity as well as their properties such as pi-systems. The generic structural fragments are organised by atom, bond, chain, ring types as well as chemical groups including amino acids, carbohydrates, ligands and nucleobases based on 729 essential chemotypes of the ToxPrint v2.0_r711.xml.',
      field: 'chm_ct',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: false,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'chm_httr',
      headerTooltip: 'Torsion fingerprints or hashed topological torsion descriptors are calculated as bit vectors using python\'s RDKit library. Developed by Nilakantan et al (1986), the topological torsion is defined as a linear sequence of 4 consecutively bonded non-hydrogen atoms, each described by its atomic type, the number of non-hydrogen branches attached to it and its number of pi electron pairs.',
      field: 'chm_httr',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: false,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'chm_mrgn',
      headerTooltip: 'Morgan fingerprints are also known as extended-connectivity fingerprint ECFP4.  These circular fingerprints are calculated within the RDKit python library as bit vectors with a radius of 3 and a length of 2048.',
      field: 'chm_mrgn',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: false,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'chm_pfas',
      headerTooltip: 'Structural features fingerprint for PFAS8a7v3 list chemicals. DOI:10.1021/acs.chemrestox.2c00403',
      field: 'chm_pfas',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: true,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'chm_phch',
      headerTooltip: 'Phys. Chem. FP see https://doi.org/10.1016/j.comtox.2018.07.001',
      field: 'chm_phch',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: true,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: 'tox_txrf',
      headerTooltip: 'ToxRef fingerprint. This is a fingerprint representation of treatment-related chemical effects derived from ToxRefDB v2. The fingerprint representation is defined by concatenating study type with effect target.',
      field: 'tox_txrf',
      cellRenderer: 'HeatColoredNumber',
      suppressMenu: true,
      filter: false,
      hide: false,
      maxWidth: 35,
      cellClass: 'ag-right-aligned-cell',
    },
  ],
  data: [
    {
      chem_id: 'DTXCID30182',
      dtxcid: 'DTXCID30182',
      dtxsid: 'DTXSID7020182',
      name: 'Bisphenol A',
      chm_mrgn: {
        value: 21,
        scaled: 0.6111,
      },
      chm_httr: {
        value: 20,
        scaled: 0.5217,
      },
      chm_ct: {
        value: 10,
        scaled: 0.5,
      },
      chm_aim: {
        value: 5,
        scaled: 0.6,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 573,
        scaled: 1,
      },
      bio_txct_ATG: {
        value: 120,
        scaled: 1,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 114,
        scaled: 1,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 97,
        scaled: 0.3913,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID7020182',
    },
    {
      chem_id: 'DTXCID001771',
      dtxcid: 'DTXCID001771',
      dtxsid: 'DTXSID8021771',
      name: '4-(2-Methylbutan-2-yl)phenol',
      chm_mrgn: {
        value: 25,
        scaled: 0.8333,
      },
      chm_httr: {
        value: 17,
        scaled: 0.3913,
      },
      chm_ct: {
        value: 10,
        scaled: 0.5,
      },
      chm_aim: {
        value: 5,
        scaled: 0.6,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 401,
        scaled: 0.6019,
      },
      bio_txct_ATG: {
        value: 95,
        scaled: 0.5,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 24,
        scaled: 0.1964,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 73,
        scaled: 0.2422,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID8021771',
    },
    {
      chem_id: 'DTXCID602360',
      dtxcid: 'DTXCID602360',
      dtxsid: 'DTXSID9022360',
      name: '4-(1,1,3,3-Tetramethylbutyl)phenol',
      chm_mrgn: {
        value: 27,
        scaled: 0.9444,
      },
      chm_httr: {
        value: 18,
        scaled: 0.4348,
      },
      chm_ct: {
        value: 9,
        scaled: 0.4167,
      },
      chm_aim: {
        value: 5,
        scaled: 0.6,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 432,
        scaled: 0.6736,
      },
      bio_txct_ATG: {
        value: 120,
        scaled: 1,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 40,
        scaled: 0.3393,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 82,
        scaled: 0.2981,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID9022360',
    },
    {
      chem_id: 'DTXCID70716',
      dtxcid: 'DTXCID70716',
      dtxsid: 'DTXSID7020716',
      name: 'Hydroquinone',
      chm_mrgn: {
        value: 10,
        scaled: 0,
      },
      chm_httr: {
        value: 8,
        scaled: 0,
      },
      chm_ct: {
        value: 4,
        scaled: 0,
      },
      chm_aim: {
        value: 2,
        scaled: 0,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 364,
        scaled: 0.5162,
      },
      bio_txct_ATG: {
        value: 70,
        scaled: 0,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 12,
        scaled: 0.0893,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 186,
        scaled: 0.9441,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID7020716',
    },
    {
      chem_id: 'DTXCID10465',
      dtxcid: 'DTXCID10465',
      dtxsid: 'DTXSID3020465',
      name: 'Diethylstilbestrol',
      chm_mrgn: {
        value: 23,
        scaled: 0.7222,
      },
      chm_httr: {
        value: 26,
        scaled: 0.7826,
      },
      chm_ct: {
        value: 11,
        scaled: 0.5833,
      },
      chm_aim: {
        value: 5,
        scaled: 0.6,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 492,
        scaled: 0.8125,
      },
      bio_txct_ATG: {
        value: 120,
        scaled: 1,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 93,
        scaled: 0.8125,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 76,
        scaled: 0.2609,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID3020465',
    },
    {
      chem_id: 'DTXCID406081',
      dtxcid: 'DTXCID406081',
      dtxsid: 'DTXSID1026081',
      name: '3,3\',5,5\'-Tetrabromobisphenol A',
      chm_mrgn: {
        value: 24,
        scaled: 0.7778,
      },
      chm_httr: {
        value: 31,
        scaled: 1,
      },
      chm_ct: {
        value: 14,
        scaled: 0.8333,
      },
      chm_aim: {
        value: 6,
        scaled: 0.8,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 419,
        scaled: 0.6435,
      },
      bio_txct_ATG: {
        value: 120,
        scaled: 1,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 16,
        scaled: 0.125,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 55,
        scaled: 0.1304,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID1026081',
    },
    {
      chem_id: 'DTXCID606',
      dtxcid: 'DTXCID606',
      dtxsid: 'DTXSID2020006',
      name: 'Acetaminophen',
      chm_mrgn: {
        value: 25,
        scaled: 0.8333,
      },
      chm_httr: {
        value: 13,
        scaled: 0.2174,
      },
      chm_ct: {
        value: 8,
        scaled: 0.3333,
      },
      chm_aim: {
        value: 7,
        scaled: 1,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 342,
        scaled: 0.4653,
      },
      bio_txct_ATG: {
        value: 70,
        scaled: 0,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 4,
        scaled: 0.0179,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 195,
        scaled: 1,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID2020006',
    },
    {
      chem_id: 'DTXCID60220',
      dtxcid: 'DTXCID60220',
      dtxsid: 'DTXSID6020220',
      name: 'tert-Butylhydroquinone',
      chm_mrgn: {
        value: 25,
        scaled: 0.8333,
      },
      chm_httr: {
        value: 17,
        scaled: 0.3913,
      },
      chm_ct: {
        value: 9,
        scaled: 0.4167,
      },
      chm_aim: {
        value: 4,
        scaled: 0.4,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 411,
        scaled: 0.625,
      },
      bio_txct_ATG: {
        value: 120,
        scaled: 1,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 21,
        scaled: 0.1696,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 115,
        scaled: 0.5031,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID6020220',
    },
    {
      chem_id: 'DTXCID402529',
      dtxcid: 'DTXCID402529',
      dtxsid: 'DTXSID4022529',
      name: 'Methylparaben',
      chm_mrgn: {
        value: 25,
        scaled: 0.8333,
      },
      chm_httr: {
        value: 15,
        scaled: 0.3043,
      },
      chm_ct: {
        value: 7,
        scaled: 0.25,
      },
      chm_aim: {
        value: 5,
        scaled: 0.6,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 354,
        scaled: 0.4931,
      },
      bio_txct_ATG: {
        value: 70,
        scaled: 0,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 8,
        scaled: 0.0536,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 34,
        scaled: 0,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID4022529',
    },
    {
      chem_id: 'DTXCID501124',
      dtxcid: 'DTXCID501124',
      dtxsid: 'DTXSID5021124',
      name: 'Phenol',
      chm_mrgn: {
        value: 13,
        scaled: 0.1667,
      },
      chm_httr: {
        value: 8,
        scaled: 0,
      },
      chm_ct: {
        value: 5,
        scaled: 0.0833,
      },
      chm_aim: {
        value: 2,
        scaled: 0,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 346,
        scaled: 0.4745,
      },
      bio_txct_ATG: {
        value: 70,
        scaled: 0,
      },
      bio_txct_BSK: {
        value: 73,
        scaled: 1,
      },
      bio_txct_NVS: {
        value: 4,
        scaled: 0.0179,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 127,
        scaled: 0.5776,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID5021124',
    },
    {
      chem_id: 'DTXCID3024495',
      dtxcid: 'DTXCID3024495',
      dtxsid: 'DTXSID5044495',
      name: '4-(4-Hydroxyphenyl)butan-2-one',
      chm_mrgn: {
        value: 28,
        scaled: 1,
      },
      chm_httr: {
        value: 13,
        scaled: 0.2174,
      },
      chm_ct: {
        value: 16,
        scaled: 1,
      },
      chm_aim: {
        value: 5,
        scaled: 0.6,
      },
      chm_pfas: {
        value: 0,
        scaled: 0,
      },
      chm_phch: {
        value: 4,
        scaled: 0,
      },
      bio_txct: {
        value: 141,
        scaled: 0,
      },
      bio_txct_ATG: {
        value: 70,
        scaled: 0,
      },
      bio_txct_BSK: {
        value: 0,
        scaled: 0,
      },
      bio_txct_NVS: {
        value: 2,
        scaled: 0,
      },
      bio_pest: {
        value: 0,
        scaled: 0,
      },
      tox_txrf: {
        value: 45,
        scaled: 0.0683,
      },
      details_link: 'https://comptox.epa.gov/dashboard/chemical/details/DTXSID5044495',
    },
  ],
};
