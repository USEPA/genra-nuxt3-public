import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import type {IHeaderParams} from 'ag-grid-community';
import {fireEvent, screen} from '@testing-library/vue';
import {createTestingPinia} from '@pinia/testing';
import type {ReadAcrossHeaderComponentParams} from '../types';
import ReadAcrossCustomHeader from './ReadAcrossCustomHeader.vue';
import {getReadAcrossMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/ReadAcrossMocks';

const testAnalogue = getReadAcrossMockResponseForBpaAndTenNeighbors.columns[2];
const testAnalogueName = testAnalogue?.headerComponentParams?.name ?? 'test';

const defaultHeaderParams = {
  chem_id: 'ep_name',
  isChecked: true,
  enableMenu: false,
  similarity: 0.5,
  targetChem: false,
  name: 'test',
  column: {
    getColId: () => '',
  },
  showColumnMenu: () => '',
} as unknown as IHeaderParams & ReadAcrossHeaderComponentParams;

describe('Read Across Custom Headers', () => {
  it('Mounts title column headers', async() => {
    await renderSuspended(ReadAcrossCustomHeader, {
      props: {
        params: defaultHeaderParams,
      },
    });
    expect(screen.getByText('test')).toBeTruthy();
  });
  it('Mounts title analogue header', async() => {
    await renderSuspended(ReadAcrossCustomHeader, {
      props: {
        params: {
          ...defaultHeaderParams,
          isChecked: false,
          targetChem: true,
          enableMenu: true,
          chem_id: testAnalogueName,
          name: testAnalogueName,
        } as unknown as IHeaderParams & ReadAcrossHeaderComponentParams,
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              appBaseStore: {
                currentStep: 4,
              },
            },
          }),
        ],
      },
    });
    expect(screen.getByText(testAnalogueName)).toBeTruthy();
  });

  it('tests click handlers', async() => {
    await renderSuspended(ReadAcrossCustomHeader, {
      props: {
        params: {
          ...defaultHeaderParams,
          isChecked: true,
          targetChem: false,
          enableMenu: true,
          chem_id: testAnalogueName,
          name: testAnalogueName,
        } as unknown as IHeaderParams & ReadAcrossHeaderComponentParams,
      },
    });

    const column = screen.getByTestId('readAcrossColumnHeader');
    await fireEvent.click(column);

    const columnMenu = screen.getByTestId('readAcrossColumnMenu');
    await fireEvent.click(columnMenu);
  });
});
