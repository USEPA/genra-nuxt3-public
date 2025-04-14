import {
  describe, it, expect,
  vi,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  fireEvent, screen, waitFor,
} from '@testing-library/vue';
import {PrimeVue} from '@primevue/core';
import AnalogueInputField from './AnalogueInputField.vue';

vi.useFakeTimers();
describe('Analogue Change Input', () => {
  it('tests analogue input change', async() => {
    const numOfAnalogues = 10;
    await renderSuspended(AnalogueInputField, {
      props: {
        numOfAnalogues,
      },
      global: {
        stubs: {
          teleport: true,
        },
        plugins: [PrimeVue],
      },
    });

    const analogueInput = screen.getByRole('spinbutton');
    await fireEvent.focus(analogueInput);
    await fireEvent.keyDown(analogueInput, {
      key: 'ArrowUp', code: 'ArrowUp', charCode: 39,
    });
    vi.runAllTimers();
    await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue((numOfAnalogues + 1).toString()));
  });
});
