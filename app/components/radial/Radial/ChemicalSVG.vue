<template>
  <svg
    v-tooltip="props.chemical.name"
    width="100%"
    height="100%"
    class="bg-[#f9fafb]"
  >
    <text
      ref="dots"
      class="dots"
      :x="size * .5"
      :y="size * .95"
      font-size="10"
    >
      ...
    </text>
    <image
      :x="size * .1"
      y="0"
      :width="size * 1"
      :height="size * 1"
      :alt="props.chemical.name"
      :href="imageUrl"
      class="bg-[#f9fafb]"
    />
    <text
      ref="text"
      class="name hover:underline"
      :x="(size) * .5"
      :y="size * .95"
      :font-size="fontSize"
    >
      {{ displayName }}
    </text>
    <title>{{ props.chemical.name }}</title>
  </svg>
</template>

<script setup lang="ts">
import type {RadialViewResponseItem} from '~/api/types';

const props = defineProps<{
  size: number;
  chemical: RadialViewResponseItem;
  numOfAnalogues: number;
}>();

const imageUrl = computed(() => getSvgImgUrl(props.chemical.chem_id));
const displayName = computed(() => props.chemical.name.length > 9 ? `${'\xA0'}${'\xA0'}${props.chemical.name.slice(0, 9)}...` : props.chemical.name);

// Avoid cutting off text when more than 13 analogues
const fontSize = computed(() => props.numOfAnalogues > 13 ? '12' : '14');
</script>

<style scoped>
text {
  text-anchor: middle;
}
.dots {
  visibility: hidden;
}
.name {
  padding-top: 10px;
}
.name:hover {display: block;}
</style>
