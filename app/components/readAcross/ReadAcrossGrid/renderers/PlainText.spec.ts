import {
  describe, it,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import type {ICellRendererParams} from 'ag-grid-community';
import {PrimeVue} from '@primevue/core';
import type {RedBlueTooltipParams} from '../types';
import PlainText from './PlainText.vue';
import type {ReadAcrossItem} from '~/api/types';

describe('Plain Text Renderer', () => {
  it('mounts', async() => {
    await renderSuspended(PlainText, {
      global: {
        plugins: [PrimeVue],
        stubs: {
          teleport: true,
        },
      },
      props: {
        params: {
          value: {
            value: 'Test Val',
          },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as unknown as ICellRendererParams<ReadAcrossItem, any, any> & RedBlueTooltipParams,
      },
    });
  });
});
