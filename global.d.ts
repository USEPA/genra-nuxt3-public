import type {KetcherObj} from '~/components/ui/Ketcher/types';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ketcher?: KetcherObj;
  }
}
