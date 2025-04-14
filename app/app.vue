<script setup lang="ts">
useHead({
  title: 'GenRA',
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico',
    },
  ],
  meta: [
    {
      charset: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    },
    {
      'http-equiv': 'cache-control',
      content: 'no-cache',
    },
    {
      'http-equiv': 'expires',
      content: '0',
    },
    {
      'http-equiv': 'pragma',
      content: 'no-cache',
    },
  ],
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
