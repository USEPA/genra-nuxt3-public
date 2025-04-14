import type {FetchOptions} from 'ofetch';

export default defineNuxtPlugin({
  name: 'fetch',
  setup() {
    const apiFetch = (fetchOptions: FetchOptions) => {
      const fetchInstance = $fetch.create({
        ...fetchOptions,
        onRequestError() {
          // Sentry error logging goes here
        },
        onResponseError() {
          // Sentry error logging goes here
        },
      });
      return fetchInstance;
    };

    return {
      provide: {apiFetch},
    };
  },
});
