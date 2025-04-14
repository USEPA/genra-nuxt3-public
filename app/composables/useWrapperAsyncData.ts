import type {AsyncDataOptions} from 'nuxt/app';

// Used for test bug -> https://github.com/nuxt/test-utils/issues/558
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useWrapperAsyncData = <T = any>(
  ...args: [string, () => Promise<T>, AsyncDataOptions<T>]
) => useAsyncData(...args);
