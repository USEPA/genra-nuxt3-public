import type {$Fetch} from 'nitropack';
import type {FetchOptions} from 'ofetch';

export default class Repository {
  fetch: $Fetch;

  constructor(fetchOptions: FetchOptions) {
    this.fetch = useNuxtApp().$apiFetch(fetchOptions);
  }
}
