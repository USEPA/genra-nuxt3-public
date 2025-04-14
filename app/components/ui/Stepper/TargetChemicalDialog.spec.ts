import {
  describe, expect, it,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {PrimeVue} from '@primevue/core';
import {createTestingPinia} from '@pinia/testing';
import {screen, within} from '@testing-library/vue';
import Stepper from './Stepper.vue';
import {TARGET_CHEMICAL_DIALOG_TITLE} from './constants';
import TargetChemicalDialog from './TargetChemicalDialog.vue';
import {testDialogMountAndUnmount} from '~/test/vitest/helpers';
import {
  setupMockResponseForBpa, setupMockResponseForMultiChemical,
} from '~/test/vitest/mockData/api/SetupMocks';

const getTargetDialogElement = () => screen.getByTestId('targetChemicalDialog');

describe('Target Dialog', () => {
  it('tests mount and unmounts', async() => {
    await testDialogMountAndUnmount(Stepper, TARGET_CHEMICAL_DIALOG_TITLE, 'Target Chemical', {
      currentStep: 1,
    }, 'targetChemicalDialog', null, {
      appBaseStore: {
        currentStep: 1,
        params: GENRA_DEFAULT_PARAMS,
      },
    });
  });

  it('tests target chemical present', async() => {
    await renderSuspended(TargetChemicalDialog, {
      props: {
        show: true,
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              appBaseStore: {
                params: GENRA_DEFAULT_PARAMS,
                setupResponse: setupMockResponseForBpa,
              },
            },
          }), PrimeVue,
        ],
      },
    });
    const {
      dsstox_cid: dtxcid, dsstox_sid: dtxsid, name,
    } = setupMockResponseForBpa;

    [
      dtxcid,
      dtxsid, name,
    ].forEach((field) => {
      expect(within(getTargetDialogElement()).getByText(field)).toBeTruthy();
    });
  });

  it('tests multi target', async() => {
    await renderSuspended(TargetChemicalDialog, {
      props: {
        show: true,
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              appBaseStore: {
                params: {...GENRA_DEFAULT_PARAMS, flags: 'multitarget'},
                setupResponse: setupMockResponseForMultiChemical,
              },
            },
          }), PrimeVue,
        ],
      },
    });
    expect(within(getTargetDialogElement()).getByText('Targets:')).toBeTruthy();
  });

  it('tests custom nn', async() => {
    await renderSuspended(TargetChemicalDialog, {
      props: {
        show: true,
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              appBaseStore: {
                params: {...GENRA_DEFAULT_PARAMS, flags: 'usernn'},
                setupResponse: setupMockResponseForMultiChemical,
              },
            },
          }), PrimeVue,
        ],
      },
    });
    expect(within(getTargetDialogElement()).getByText('Neighbors:')).toBeTruthy();
  });
});
