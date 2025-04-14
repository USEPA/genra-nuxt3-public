import vueAxe from 'vue-axe';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vueAxe);
});
