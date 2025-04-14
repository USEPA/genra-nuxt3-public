import {
  describe, it, expect,

} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {screen} from '@testing-library/vue';

import MoreInfoDialog from './MoreInfoDialog.vue';
import Navbar from './Navbar.vue';
import {
  CONTACT_LINKS, DOCUMENTATION_LINKS, MORE_INFO_DIALOG_TITLE, PUBLICATION_LINKS,
} from './config';
import {mockGenraEndpoint, testDialogMountAndUnmount} from '~/test/vitest/helpers';
import {mockVersion} from '~/test/vitest/mockData/api/SetupMocks';

mockGenraEndpoint('VERSION', mockVersion);

describe('More Info Dialog', () => {
  it('tests dialog opens and closes', async() => {
    await testDialogMountAndUnmount(Navbar, MORE_INFO_DIALOG_TITLE, 'More Info', {
      version: mockVersion,
    }, 'moreInfoDialog');
  });

  it('Ensures all row titles are rendered', async() => {
    await renderSuspended(MoreInfoDialog, {
      props: {
        show: true,
        version: mockVersion,
      },
    });
    [
      'Version:',
      'Contact:',
      'Documentation:',
      'Publications:',
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  it('Ensures all links are rendered', async() => {
    await renderSuspended(MoreInfoDialog, {
      props: {
        show: true,
        version: mockVersion,
      },
    });

    expect(screen.getByText(mockVersion)).toBeTruthy();

    const allLinks = CONTACT_LINKS.concat(DOCUMENTATION_LINKS).concat(PUBLICATION_LINKS);
    allLinks.forEach((link) => {
      expect(screen.getByText(link.label)).toBeTruthy();
      expect(screen.getByText(link.label).closest('a')).toHaveAttribute('href', link.href);
      expect(screen.getByText(link.label).closest('a')).toHaveAttribute('target', link.target);
      expect(screen.getByText(link.label).closest('a')).toHaveAttribute('title', link.title);
    });
  });
});
