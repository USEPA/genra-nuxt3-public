import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, it, expect,
} from 'vitest';
import {
  fireEvent, screen,
} from '@testing-library/vue';
import {createTestingPinia} from '@pinia/testing';
import Stepper from './Stepper.vue';

describe('Stepper', () => {
  it('tests steps are disabled', async() => {
    const currentStep = 1;
    await renderSuspended(Stepper, {
      props: {
        currentStep,
      },
    });
    steps.slice(currentStep + 1).forEach((step) => {
      expect(screen.getByLabelText(step)).toBeDisabled();
    });
  });

  it('tests navigation steps', async() => {
    const currentStep = 2;
    await renderSuspended(Stepper, {
      props: {
        currentStep,
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              useAppBaseStore: {
                currentStep,

              },
            },
          }),
        ],
      },
    });
    const previousBtn = screen.getByRole('button', {name: steps[currentStep - 1]});
    await fireEvent.click(previousBtn);
    expect(previousBtn).not.toBeDisabled();
  });
});
