import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {PrimeVue} from '@primevue/core';
import {createTestingPinia} from '@pinia/testing';
import {fireEvent, screen} from '@testing-library/vue';
import Help from './Help.vue';
import {HelpTextKey} from './constants';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';

describe('Help Icon', () => {
  it('tests opening and closing', async() => {
    await renderSuspended(Help, {
      props: {
        helpKey: HelpTextKey.RADIAL,
      },
      global: {
        plugins: [
          PrimeVue, createTestingPinia({
            initialState: {
              appBaseStore: {
                params: GENRA_DEFAULT_PARAMS,
                setupResponse: setupMockResponseForBpa,
                currentStep: 3,
                showErrorDialog: true,
              },
            },
          }),
        ],
      },
    });
    const activatorBtn = screen.getByRole('button', {
      name: 'Help Icon',
    });
    expect(activatorBtn).toBeTruthy();
    await fireEvent.click(activatorBtn);
    const selectedHelpText = setupMockResponseForBpa.help_text
      .find(({helpTextId}) => helpTextId.toLowerCase() === HelpTextKey.RADIAL);

    if (selectedHelpText) {
      expect(screen.getByText(selectedHelpText.helpText)).toBeTruthy();
    }
  });
});
