import {afterEach, vi} from 'vitest';
import '@testing-library/jest-dom/vitest';
import {cleanup} from '@testing-library/vue';
import 'vitest-canvas-mock';

// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Run cleanup after each test
afterEach(() => {
  cleanup();
});
