
export default defineNuxtConfig({
  extends: ['@usepa/ccte-epa-header-footer'],
  app: {
    baseURL: process.env.APPLICATION_ROUTER_BASE,
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/genra/favicon.ico',
        },
      ]
    }
  },
  future: {
    compatibilityVersion: 4,
  },
  // To re-enable _all_ Nuxt v3 behavior, set the following options:
  // srcDir: '.',
  // dir: {
  //   app: 'app'
  // },
  // experimental: {
  //   sharedPrerenderData: false,
  //   compileTemplate: true,
  //   resetAsyncDataToUndefined: true,
  //   templateUtils: true,
  //   relativeWatchPaths: true,
  //   defaults: {
  //     useAsyncData: {
  //       deep: true
  //     }
  //   }
  // },
  // unhead: {
  //   renderSSRHeadOptions: {
  //     omitLineBreaks: false
  //   }
  // },
  ssr: true,
  components: [
    {
      path: './components',
      prefix: 'Grids',
    },
  ],
  hooks: {
    'components:dirs': (dirs) => {
      dirs.push({
        path: '~/components/grids',
        prefix: 'grids',
      });
    },
  },
  presets: [
    'pinia',
    '@',
  ],
  css: [
    'ag-grid-community/styles/ag-grid.css',
    'ag-grid-community/styles/ag-theme-balham.css',
    'animate.css/animate.css',
    '@/assets/css/tailwind.css',
    '@/assets/css/base.css',
    'primeicons/primeicons.css',
  ],
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs'],
      },
    ],
    'nuxt-security',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxt/test-utils/module',
    'nuxt-icons',
    '@vueuse/nuxt',
    '@formkit/auto-animate/nuxt',
  ],
  eslint: {
    config: {
      stylistic: {
        semi: true,
        indent: 2,
        quotes: 'single',
      },
    },
  },
  primevue: {
    autoImport: true,
    options: {
      theme: 'none',
    },
  },
  security: {
    headers: {
      crossOriginResourcePolicy: ['*.localhost', '*.epa.gov'],
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : ['*.localhost', '*.epa.gov'],
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'script-src': ["'self'", '*.localhost', 'https:', 'data:', '*.epa.gov', "'unsafe-eval'", "'unsafe-inline'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", '*.localhost', 'https:', 'data:', '*.epa.gov:*'],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'upgrade-insecure-requests': false,
      },
      strictTransportSecurity: {
        maxAge: 15552000,
        includeSubdomains: true,
      },
    },
  },


  devtools: {enabled: false},

  runtimeConfig: {
    public: {
      APPLICATION_ENVIRONMENT_LABEL: process.env.APPLICATION_ENVIRONMENT_LABEL,
      APPLICATION_IMPACT_API: process.env.APPLICATION_IMPACT_API,
      APPLICATION_CCD_API: process.env.APPLICATION_CCD_API,
      APPLICATION_PUBLIC_API: process.env.APPLICATION_PUBLIC_API,
      APPLICATION_GENRA_API_BASE: process.env.APPLICATION_GENRA_API_BASE,
      APPLICATION_CCD_API_BASE:  process.env.APPLICATION_CCD_API_BASE,
      API_KEY: process.env.API_KEY,
      APPLICATION_STG_API: process.env.APPLICATION_STG_API,
      APPLICATION_GA_API: process.env.APPLICATION_GA_API,
      APPLICATION_EXTERNAL_LINK_URL: process.env.APPLICATION_EXTERNAL_LINK_URL,
      APPLICATION_ROUTER_BASE: process.env.APPLICATION_ROUTER_BASE,
      APPLICATION_TITLE: process.env.APPLICATION_TITLE,
      SENTRY_DSN: process.env.SENTRY_DSN,
      SENTRY_ENABLE_DEBUG: process.env.SENTRY_ENABLE_DEBUG,
      SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
    },
  },
  postcss: {
    plugins: {
      'postcss-import': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    optimizeDeps: {
      include: ['axe-core'],
    },
  },

  compatibilityDate: '2024-12-20',
});
