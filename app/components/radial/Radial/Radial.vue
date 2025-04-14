<template>
  <svg
    v-if="props.chemicals.length"
    class="h-full w-full"
    preserveAspectRatio="xMidYMid meet"
    viewBox="-45 0 625 500"
  >
    <ChemicalSVG
      :chemical="targetChemical"
      :size="size"
      :num-of-analogues="neighbors.length"
      :x="length / 2 - size / 2"
      :y="length / 2 - size / 2"
    />
    <g
      v-for="(neighbor, i) in neighbors"
      :key="neighbor.chem_id"
    >
      <a
        v-if="neighbor.details_link"
        :href="neighbor.details_link"
        :title="neighbor.name"
        target="_blank"
      >
        <ChemicalSVG
          :chemical="neighbor"
          :size="size"
          :num-of-analogues="neighbors.length"
          :x="xPosition(radius, i) - size / 2"
          :y="yPosition(radius, i) - size / 2"
        />
      </a>
      <ChemicalSVG
        v-else
        :chemical="neighbor"
        :size="size"
        :num-of-analogues="neighbors.length"
        :x="xPosition(radius, i) - size / 2"
        :y="yPosition(radius, i) - size / 2"
      />
      <line
        class="edge"
        :x1="xPosition(70, i)"
        :y1="yPosition(70, i)"
        :x2="xPosition(radius - 70, i)"
        :y2="yPosition(radius - 70, i)"
      />
      <circle
        class="neighborlabel"
        r="20"
        :cx="xPosition(radius / 2, i)"
        :cy="yPosition(radius / 2, i)"
      />
      <text
        class="neighborlabel"
        :x="xPosition(radius / 2, i)"
        :y="yPosition(radius / 2, i) + 4"
      >
        {{ neighbor.value.toFixed(2) }}{{ neighbor.similarity_tag || '' }}
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import ChemicalSVG from './ChemicalSVG.vue';
import type {RadialViewResponseItem} from '~/api/types';

const props = defineProps<{
  chemicals: RadialViewResponseItem[];
  numOfAnalogues: number;
}>();

const length = ref(500);
const lastRadial = ref(5.8);

const targetChemical = computed(() => props.chemicals[0] as RadialViewResponseItem);

const neighbors = computed(() => props.chemicals.slice(1));

const theta = computed(() => lastRadial.value / neighbors.value.length);

const size = computed(() => (length.value / 2) / (1 / ((2 / Math.sqrt(2)) * Math.sin(theta.value / 2)) + 0.5));

const radius = computed(() => (length.value / 2) - (size.value / 2));

const xPosition = (xRadius: number, index: number) => {
  return length.value / 2 + (xRadius * Math.sin(lastRadial.value * (index / (neighbors.value.length))));
};

const yPosition = (yRadius: number, index: number) => {
  return length.value / 2 - (yRadius * Math.cos(lastRadial.value * (index / (neighbors.value.length))));
};
</script>

<style scoped>
text {
  text-anchor: middle;
  font-size: 0.75vw;
  z-index: 3;
}
.edge {
  stroke: black;
  stroke-width: 2px;
  transition: 1s all;
}
g:hover > .edge {
  stroke: red;
  stroke-width: 4px;
}
.neighborlabel {
  fill: white;
  stroke: red;
  opacity: 0;
}
g:hover > .neighborlabel {
  opacity: 1;
}

@media screen and (max-width: 992px) {
  g:hover > .neighborlabel {
    font-size: 12px;
  }
}
</style>
