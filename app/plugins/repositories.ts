import GenraRepository from '~/api/GenraRepository';

export default defineNuxtPlugin({
  name: 'repositores',
  dependsOn: ['fetch'],
  setup() {
    const repositores = {
      genra: new GenraRepository(),
    };

    return {
      provide: {
        repositores,
      },
    };
  },
});
