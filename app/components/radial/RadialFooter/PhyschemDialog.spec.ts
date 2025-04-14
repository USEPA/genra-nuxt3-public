import {describe, it} from 'vitest';
import RadialPanel from '../RadialPanel.vue';
import {PHYSCHEM_DIALOG_HEADER_TEXT} from '../constants';
import {testDialogMountAndUnmount} from '~/test/vitest/helpers';
import {setupMockResponseForBpa} from '~/test/vitest/mockData/api/SetupMocks';
import {radialMockResponseForBpaAndTenNeighbors} from '~/test/vitest/mockData/api/RadialMocks';

describe('Physchem Dialog', () => {
  it('tests mounting and unmounting', async() => {
    await testDialogMountAndUnmount(RadialPanel, PHYSCHEM_DIALOG_HEADER_TEXT, 'Physchem Data', null, 'physchemDialog', null,
      {
        appBaseStore: {
          params: GENRA_DEFAULT_PARAMS,
          currentStep: 1,
          setupResponse: setupMockResponseForBpa,
        },
        radialStore: {
          isRadialPanelLoading: false,
          radialResponse: radialMockResponseForBpaAndTenNeighbors,
          physchemPlotUrl: 'Test String',
          neighborByOptions: setupMockResponseForBpa.neighbor_by,
          filterByOption: setupMockResponseForBpa.filter_by,
        },
      });
  });
});
