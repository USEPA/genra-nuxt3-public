import {
  VueForceGraph2D,
} from 'vue-force-graph';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueForceGraph2D);
});
