import {defineVitestConfig} from '@nuxt/test-utils/config';
import {loadEnv} from "vite";
import {coverageConfigDefaults} from "vitest/config";

export default defineVitestConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reportsDirectory: '../test/vitest/coverage',
      ignoreClassMethods: ['useResizeObserver'],
      thresholds: {
        statements: 75,
        branches: 75,
        functions: 75,
        lines: 75,
      },
      include: [
        '**/*.js',
        '**/*.ts',
        '**/*.vue',
      ],
      exclude: [
          ...coverageConfigDefaults.exclude, 
          '**/*.spec.ts',
          'coverage/',
          '**/coverage/',
          '**/node_modules/',
          'nuxt/',
          'assets/',
          'app.vue', 'plugins/', 'test/',
          '**/*ColumnDefs.ts',
          '**/*{c,C}onstants.ts',
          '**/stores/settings.ts',
          '**/composables/*.ts',
          '**/*GridOptions.ts',
          '**/*gridUtil.ts',
          '**/*helpers.ts'
      ]
    },
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
        dotenv: {
          fileName: '.env'
        }
      },
    },
    env: loadEnv('development',process.cwd(),''),
    globals: true,
    testTimeout: 30000,
    setupFiles: ['./test/vitest/vitest-setup.ts'],
    deps: {
      inline: ['vitest-canvas-mock'],
      optimizer: {
        web: {
          include: ['vitest-canvas-mock']
        }
      }
    },
    // remove Suspense message from console
    onConsoleLog(log) {
      if (log.includes('<Suspense> is an experimental feature and its API will likely change.')) {
        return false
      }
    }
  },
});
