import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, screen, waitFor,
} from '@testing-library/vue';
import ReadAcrossPaginationSwitch from './ReadAcrossPaginationSwitch.vue';
import {PAGINATION_LABEL_TEXT} from '~/components/assay/AssayMenuBar/constants';

describe('RA Pagination Switch', () => {
  it('tests default mounted state', async() => {
    await renderSuspended(ReadAcrossPaginationSwitch, {
      props: {
        paginate: false,
      },
      global: {
        plugins: [PrimeVue],
      },
    });
    const pagination = screen.getByRole('switch', {name: PAGINATION_LABEL_TEXT});
    expect(pagination).not.toBeChecked();
  });

  it('tests changing pagination', async() => {
    await renderSuspended(ReadAcrossPaginationSwitch, {
      props: {
        paginate: false,
      },
      global: {
        plugins: [PrimeVue],
      },
    });
    const pagination = () => screen.getByRole('switch', {name: PAGINATION_LABEL_TEXT});
    await fireEvent.click(pagination());
    await waitFor(() => expect(pagination()).toBeChecked());
  });
});
