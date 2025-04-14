import {
  afterEach,
  beforeEach,
  describe, expect, it,
  vi,
} from 'vitest';
import {
  fireEvent, screen,
} from '@testing-library/vue';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import Navbar from './Navbar.vue';
import KetcherDialog from './KetcherDialog.vue';
import {KETCHER_DIALOG_TITLE, KETCHER_ERR_MSG} from './config';
import {mockGenraEndpoint, testDialogMountAndUnmount} from '~/test/vitest/helpers';
import {mockVersion} from '~/test/vitest/mockData/api/SetupMocks';

mockGenraEndpoint('VERSION', mockVersion);
describe('Ketcher Dialog', () => {
  beforeEach(() => {
    vi.useFakeTimers({shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('Dialog mounts and unmounts', async() => {
    await testDialogMountAndUnmount(Navbar, KETCHER_DIALOG_TITLE, 'Ketcher', {version: mockVersion}, 'ketcherDialog', 'Cancel');
  });

  it('Shows validation when attempting to search without a structure', async() => {
    await renderSuspended(KetcherDialog, {
      props: {
        show: true,
      },
    });

    const searchBtn = screen.getByRole('button', {
      name: /Search/i,
    });
    expect(screen.queryByText(KETCHER_ERR_MSG)).toBeFalsy();
    await fireEvent.click(searchBtn);
    expect(screen.getByText(KETCHER_ERR_MSG)).toBeTruthy();
  });
});
