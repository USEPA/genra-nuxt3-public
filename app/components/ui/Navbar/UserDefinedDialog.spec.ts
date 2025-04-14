import {
  describe, it, expect,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  fireEvent, screen, within,
} from '@testing-library/vue';
import {USER_DEFINED_DIALOG_PLACEHOLDER_TXT, USER_DEFINED_DIALOG_TITLE} from './config';
// im
import Navbar from './Navbar.vue';
import UserDefinedDialog from './UserDefinedDialog.vue';
import {testDialogMountAndUnmount} from '~/test/vitest/helpers';
import {mockVersion} from '~/test/vitest/mockData/api/SetupMocks';

export const getUserDefinedSearchTextInput = () => within(screen.getByTestId('userDefinedDialog')).getByPlaceholderText(USER_DEFINED_DIALOG_PLACEHOLDER_TXT);

const searchBtn = () => screen.getByRole('button', {
  name: /Search/i,
});

describe('User Defined Dialog', () => {
  it('tests dialog opens and closes', async() => {
    await testDialogMountAndUnmount(Navbar, USER_DEFINED_DIALOG_TITLE, 'User-defined', {
      version: mockVersion,
    }, 'userDefinedDialog');
  });

  it('tests validations', async() => {
    await renderSuspended(UserDefinedDialog, {
      props: {
        show: true,
      },
    });

    // Search should be disabled if input is empty
    await fireEvent.update(getUserDefinedSearchTextInput(), '');
    expect(searchBtn()).toBeDisabled();

    // Search should be enabled with valid search string.
    await fireEvent.update(getUserDefinedSearchTextInput(), 'test');
    expect(searchBtn()).not.toBeDisabled();

    // Search should be disabled if only commas exist
    await fireEvent.update(getUserDefinedSearchTextInput(), ',');
    expect(searchBtn()).toBeDisabled();
    await fireEvent.update(getUserDefinedSearchTextInput(), ',,,,,');
    expect(searchBtn()).toBeDisabled();
  });

  it('tests predictions checkbox', async() => {
    await renderSuspended(UserDefinedDialog, {
      props: {
        show: true,
      },
    });

    const predictionsCheckbox = within(screen.getByTestId('userDefinedDialog')).getByRole('checkbox');
    expect(predictionsCheckbox).not.toBeChecked();

    await fireEvent.click(predictionsCheckbox);
    expect(predictionsCheckbox).toBeChecked();
  });

  it('tests search', async() => {
    await renderSuspended(UserDefinedDialog, {
      props: {
        show: true,
      },
    });

    await fireEvent.update(getUserDefinedSearchTextInput(), 'test, test1, test2, \n test4');

    await fireEvent.click(searchBtn());

    expect(screen.queryByPlaceholderText(USER_DEFINED_DIALOG_TITLE)).toBeFalsy();
  });
});
