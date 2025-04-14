import {registerEndpoint, renderSuspended} from '@nuxt/test-utils/runtime';
import {createTestingPinia} from '@pinia/testing';
import {PrimeVue} from '@primevue/core';
import {
  fireEvent, within, screen,
} from '@testing-library/vue';
import type {EventHandler, HTTPMethod} from 'h3';
import {
  expect, it, type Mock,
} from 'vitest';
import type {Component, ComponentCustomProps} from 'vue';
import {mockVersion} from './mockData/api/SetupMocks';
import {radialMockResponseForBpaAndTenNeighbors} from './mockData/api/RadialMocks';
import {nExplorerResponseForBpaAndTenNeighbors} from './mockData/api/NeighborhoodExplorerMocks';
import {fingerprintMockResponseForBpaAndTenNeighbors} from './mockData/api/FingerprintMocks';
import {assayMockResponseForBpaAndTenNeighbors} from './mockData/api/AssayMocks';
import {getReadAcrossMockResponseForBpaAndTenNeighbors, runReadAcrossMockResponseForBpaAndTenNeighbors} from './mockData/api/ReadAcrossMocks';
import {GenraEndpoints, type GenraEndpoint} from '~/api/helpers';

export const mockGenraEndpoint = (endpoint: GenraEndpoint, responseObj: string | object | Mock, options?: {
  handler?: EventHandler;
  method?: HTTPMethod;
  appendEndpoint?: string;
}) => {
  const {APPLICATION_GENRA_API_BASE: baseURL} = useRuntimeConfig().public;

  const defaultHandler = () => responseObj;

  registerEndpoint(`${baseURL}${GenraEndpoints[endpoint]}${options?.appendEndpoint ?? ''}`, {
    method: options?.method ?? 'GET',
    handler: options?.handler || defaultHandler,
  });
};

/**
 * Helper method to use on every dialog to test the mounting/unmounting.
 * @param component
 * @param dialogTitle
 * @param btnLabel
 * @param componentProps
 * @param cancelBtn
 */
export const testDialogMountAndUnmount = async(component: Component,
  dialogTitle: string,
  btnLabel: string,
  componentProps: ComponentCustomProps | null,
  dataTestId: string,
  cancelBtn: string | null = null,
  initialState: object = {}) => {
  await renderSuspended(component, {
    props: {
      ...(componentProps && {...componentProps}),
    },
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            appBaseStore: {
              params: GENRA_DEFAULT_PARAMS,
            },
            ...initialState,
          },
        }), PrimeVue,
      ],
      stubs: {
        teleport: true,
      },
    },
  });
  // Dialog should not be open on mount
  expect(screen.queryByTestId(dataTestId)).toBeFalsy();
  const activatorBtn = screen.getByText(btnLabel);
  expect(activatorBtn).toBeTruthy();

  // Dialog should open when clicked
  await fireEvent.click(activatorBtn);
  expect(within(screen.getByTestId(dataTestId)).queryByText(dialogTitle)).toBeTruthy();
  // Dialog should close when click X btn
  const closeBtn = within(screen.getByTestId(dataTestId)).getByRole('button', {
    name: /Close/i,
  });
  expect(closeBtn).toBeTruthy();
  await fireEvent.click(closeBtn);
  expect(screen.queryByRole('dialog')).toBeFalsy();

  // Dialog should close when click Cancel btn
  if (cancelBtn) {
    const cancelBtnRegex = new RegExp(String.raw`${cancelBtn}`, 'i');
    await fireEvent.click(activatorBtn);
    const cancelBtnEle = within(screen.getByTestId(dataTestId)).getByRole('button', {
      name: cancelBtnRegex,
    });
    expect(cancelBtn).toBeTruthy();
    await fireEvent.click(cancelBtnEle);
    expect(screen.queryByRole('dialog')).toBeFalsy();
  }
};

// Mock all endpoints for GenRA. Good for workflow tests
export const mockAllGenRAEndpointsWithBpaAndTenNeighbors = () => {
  mockGenraEndpoint('VERSION', mockVersion);
  mockGenraEndpoint('RADIAL', radialMockResponseForBpaAndTenNeighbors);
  mockGenraEndpoint('NEXPLORER', nExplorerResponseForBpaAndTenNeighbors);
  mockGenraEndpoint('PHYSCHEM_PLOT', 'test');
  mockGenraEndpoint('FINGERPRINT', fingerprintMockResponseForBpaAndTenNeighbors);
  mockGenraEndpoint('ASSAY', assayMockResponseForBpaAndTenNeighbors);
  mockGenraEndpoint('GET_READACROSS', getReadAcrossMockResponseForBpaAndTenNeighbors);
  mockGenraEndpoint('RUN_READACROSS', runReadAcrossMockResponseForBpaAndTenNeighbors);
};

// Conditionally run tests (useful for mock data that can change)
export const itif = (condition: boolean) => (condition ? it : it.skip);
