
  

  

# GenRA Nuxt3

  

  

  

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

  

  

  

Also check out [Vue 3 documentation](https://vuejs.org), Nuxt 3 is built on Vue 3.

  

  

  

## Included Features

  

  

  

* ESLint, lint-staged, Husky for enforcing linting all files on commit.

  

  

* @pinia/nuxt to allow use of [Pinia](https://pinia.vuejs.org) for state management/data stores.

  

  

* [Nuxt 3](https://nuxt.com/)

  

  

* [@formkit/auto-animate](https://auto-animate.formkit.com/) for transitions.

  

  

* [@vueuse/nuxt](https://nuxt.com/modules/vueuse) module for [VueUse](https://vueuse.org/)

  

  

* [ag-grid-enterprise vue3](https://www.ag-grid.com/vue-data-grid/getting-started/)

  

  

* [@nuxtjs/tailwindcss](https://nuxt.com/modules/tailwindcss)

  

  

* [vitest](https://vitest.dev/)

  

  

* [typescript@^5.7.3](https://www.typescriptlang.org/)

  

  

* [primevue](https://primevue.org/) Vue3 component library with nuxt-primevue module integration.

  

  

* [Nuxt-security](https://nuxt.com/modules/security) OWASP based security module.

  

  

* [Vue 3](https://vuejs.org), Nuxt 3 is built on Vue 3.

  

  

* [Axe-vue](https://github.com/vue-a11y/vue-axe-next) for interactivly checking 508 compliance.

  

  

* [nuxt-devtools](https://devtools.nuxt.com/) in browser dev tools for nuxt.

  

  

  

## Setup

  

  

* Create a directory in your dev environment called "Genra" or a name of your choice.

  

  

* Clone https://github.com/USEPA/genra-nuxt3.git into this directory.

  

  

* cd into genra-nuxt3.

  

  

* Create a new file named `.env`.

  

  

* Copy contents of `.env_template` to `.env`.

  

  

* Add two extra environment variables to the `.env` file.

  
	*  `APPLICATION_ENVIRONMENT_LABEL` - this should be `LOCAL DEV` or any string with `LOCAL` in it if running locally. 

  

	*  `GITHUB_TOKEN` - this will be your GitHub personal access token which is required to access the private npm registry. Please see this [link for creating a personal access token if needed.](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

  

* Install the dependencies:

`pnpm install`

  

  

  

## Development Server

  

  

  

Start the development server on `http://localhost:3000`:

  

`pnpm run dev`

  

  

  

## Production

  

Build the application for production:

  

`pnpm run build`

  

Locally preview production build:

  

`pnpm run preview`

  

  

  

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.