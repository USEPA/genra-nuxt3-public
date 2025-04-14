/**
 * All config objects for nav bar
 */

import type {NuxtLinkProps} from '#app';

// More Info Dialog
interface MoreInfoLink extends NuxtLinkProps {
  label: string;
  title: string;
  icon?: string;
}

export const MORE_INFO_DIALOG_TITLE = 'About GenRA';

export const PUBLICATION_LINKS: MoreInfoLink[] = [
  {
    label: '2016',
    href: 'https://doi.org/10.1016/j.yrtph.2016.05.008',
    target: '_blank',
    title: 'GenRA Publication',
  },
  {
    label: '2022',
    href: 'https://doi.org/10.1016/j.comtox.2022.100258',
    target: '_blank',
    title: 'GenRA Publication',
  },
];

export const DOCUMENTATION_LINKS: MoreInfoLink[] = [
  {
    label: 'GenRA Documentation',
    href: 'https://www.epa.gov/chemical-research/generalized-read-across-genra-manual',
    target: '_blank',
    title: 'GenRA Documentation',
    icon: 'pi-book',
  },
];

export const CONTACT_LINKS: MoreInfoLink[] = [
  {
    label: 'genra.support@epa.gov',
    href: 'mailto:genra.support@epa.gov?subject=Comments on GenRA',
    target: '_blank',
    title: 'Contact GenRA',
    icon: 'pi-envelope',
  },
];

// Ketcher
export const KETCHER_DIALOG_TITLE = 'Ketcher Structure Editor';

export const KETCHER_ERR_MSG = 'Must have a valid structure.';

// User Defined
export const USER_DEFINED_DIALOG_TITLE = 'User Defined Search';

export const USER_DEFINED_DIALOG_PLACEHOLDER_TXT = 'Enter target chemicals';

// Type ahead search
export const TYPEAHEAD_SEARCH_PLACEHOLDER_TXT = 'Start typing to search, use a chemical name, synonym, SMILES, DSSTOX CID or SID, CASRN, or InChI-Key.';
