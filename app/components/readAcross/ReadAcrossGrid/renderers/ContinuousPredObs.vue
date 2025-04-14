<template>
  <div class="h-full w-full">
    <svg
      data-cy="ra-continuous-svg"
      data-testid="raContinuousSvg"
      width="100%"
      height="100%"
    >
      <linearGradient id="scaleGradient">
        <stop
          offset="8%"
          :stop-color="gradientStartColor"
        />
        <stop
          offset="92%"
          :stop-color="gradientEndColor"
        />
      </linearGradient>
      <rect
        id="scaleRect"
        width="92"
        height="9"
        :x="leftRectXOffSet"
        y="10"
        fill="url(#scaleGradient)"
      />
      <!-- Estimate text -->
      <text
        v-if="showEstimate"
        :id="textId"
        :ref="textId"
        :x="calculateEstimateText"
        data-testid="raContinuousSvgEstimate"
        y="8"
        :style="`font-size: 9.5px !important`"
      >
        {{ continuousData.est_disp }}
      </text>

      <!-- Observation text -->
      <text
        v-if="showObservationText"
        :x="calculateObservationText"
        y="8"
        :style="`font-size: 9.5px !important`"
      >
        {{ continuousData.obs_disp }}
      </text>
      <!-- Observation -->
      <circle
        v-if="showObservation"
        :cx="calculateObservationScale"
        cy="14"
        r="4.5"
        fill="white"
        stroke="black"
        stroke-width="1.2"
      />
      <!-- T left of estimate -->
      <line
        v-if="showEstimate && showLeftT"
        :x1="calculateLeftTStartScale"
        data-testid="raContinuousTLine"
        y1="3"
        :x2="calculateLeftTEndScale"
        y2="3"
        stroke="black"
      />
      <line
        v-if="showEstimate && showLeftT"
        :x1="calculateLeftTEndScale"
        y1=".5"
        :x2="calculateLeftTEndScale"
        y2="5.5"
        stroke="black"
      />

      <!-- T right of estimate -->
      <line
        v-if="showEstimate && showRightT"
        :x1="calculateRightTStartScale"
        y1="3"
        :x2="calculateRightTEndScale"
        y2="3"
        stroke="black"
      />
      <line
        v-if="showEstimate && showRightT"
        :x1="calculateRightTEndScale"
        y1=".5"
        :x2="calculateRightTEndScale"
        y2="5.5"
        stroke="black"
      />

      <!-- estimate -->
      <polygon
        v-if="showEstimate"
        fill="white"
        stroke="black"
        stroke-width="1.2"
        :points="calculateEstimateScale"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {ReadAcrossContinuousCellItem, ReadAcrossItem} from '~/api/types';

const props = defineProps<{
  params: ICellRendererParams<ReadAcrossItem>;
}>();

const rectComputedWidth = ref<null | number>(null);
const estimateTextWidth = ref<null | number>(null);
const scaleXOffSetCalculation = ref<null | number>(null);

onMounted(() => {
  setTimeout(() => {
    const textEle = document.getElementById(`${textId.value}`) as unknown as SVGTextElement;
    if (textEle && 'getComputedTextLength' in textEle) {
      estimateTextWidth.value = textEle.getComputedTextLength();
    }
  }, 0);

  setTimeout(() => {
    const rectEle = document.getElementById('scaleRect');
    if (rectEle) {
      rectComputedWidth.value = 100 - rectEle.getBoundingClientRect().width;
    }
  }, 0);
});

watch(rectComputedWidth, (newVal) => {
  const leftXOffset = Number.parseFloat(leftRectXOffSet);
  if (newVal !== null) {
    scaleXOffSetCalculation.value = leftXOffset - newVal;
  }
});

const continuousData = computed(() => props.params.value as ReadAcrossContinuousCellItem);

const leftRectXOffSet = '8';

const gradientStartColor = computed(() => continuousData.value.dir === 'RL' ? '#87070a' : '#477fb0');
const gradientEndColor = computed(() => continuousData.value.dir === 'RL' ? '#477fb0' : '#87070a');

const textId = computed(() => `${props.params?.data?.ep_name ?? ''}${props.params.colDef?.field ?? ''}`);

// Estimate

const calculateEstimateScale = computed(() => {
  const centerTriangleXpoint = calculateEstimatePoint.value;
  const leftTriangleXpoint = centerTriangleXpoint - 5;
  const rightTriangleXpoint = centerTriangleXpoint + 5;
  return `${centerTriangleXpoint} 10.5, ${leftTriangleXpoint} 18.5, ${rightTriangleXpoint} 18.5`;
});
const showEstimate = computed(() => !!continuousData.value?.estimate);
const calculateEstimatePoint = computed(() => {
  const estimatePoint = ((((continuousData.value.estimate ?? 0) - continuousData.value.rangeMin) /
    (continuousData.value.rangeMax - continuousData.value.rangeMin)) * 100) + (scaleXOffSetCalculation.value ?? 0);
  return estimatePoint < Number.parseInt(leftRectXOffSet, 0) ? Number.parseInt(leftRectXOffSet, 0) : estimatePoint;
});

const calculateEstimateText = computed(() => {
  if (!continuousData.value?.est_disp) {
    return calculateEstimatePoint.value;
  }
  if (calculateEstimatePoint.value >= 95 && continuousData.value?.est_disp.length > 2) {
    return calculateEstimatePoint.value - 7;
  }
  if (calculateEstimatePoint.value >= 8 && calculateEstimatePoint.value <= 8.5 &&
    continuousData.value?.est_disp.length > 2) {
    return calculateEstimatePoint.value + 5;
  }
  return calculateEstimatePoint.value;
});

// Observation
const showObservationText = computed(() => !!continuousData.value?.observation && !continuousData.value.estimate);

const showObservation = computed(() => !!continuousData.value?.observation);

const calculateObservationScale = computed(() => {
  const observationPoint = ((((continuousData.value.observation ?? 0) - continuousData.value?.rangeMin) /
    (continuousData.value?.rangeMax - continuousData.value?.rangeMin)) * 100) + (scaleXOffSetCalculation.value ?? 0);
  return observationPoint < Number.parseInt(leftRectXOffSet, 0) ? Number.parseInt(leftRectXOffSet, 0) : observationPoint;
});
const calculateObservationText = computed(() => {
  if (!continuousData.value?.obs_disp) {
    return calculateObservationScale.value;
  }
  if (calculateObservationScale.value >= 95 && continuousData.value?.obs_disp.length > 2) {
    return calculateObservationScale.value - 7;
  }
  if (calculateObservationScale.value >= 8 && calculateObservationScale.value <= 9 &&
    continuousData.value?.obs_disp.length > 2) {
    return calculateObservationScale.value + 5;
  }
  return calculateObservationScale.value;
});

// T Lines
const calculateLeftTStartScale = computed(() => calculateEstimatePoint.value - ((estimateTextWidth.value ?? 0) / 2));

const showLeftT = computed(() => {
  if (!continuousData.value.confMin) {
    return false;
  }
  if (continuousData.value?.estimate === 0 ||
    calculateLeftTStartScale.value < Number.parseInt(leftRectXOffSet, 0) ||
    calculateLeftTStartScale.value < Number.parseInt(leftRectXOffSet, 0)) {
    return false;
  }
  return true;
});

const calculateLeftTEndScale = computed(() => {
  return ((((continuousData.value.confMin ?? 0) - continuousData.value.rangeMin) /
    (continuousData.value.rangeMax - continuousData.value.rangeMin)) * 100) -
    ((estimateTextWidth.value ?? 0) / 2) + (scaleXOffSetCalculation.value ?? 0);
});

const showRightT = computed(() => {
  if (!continuousData.value.confMax) {
    return false;
  }
  if (continuousData.value?.estimate === 0 && continuousData.value?.confMax <= 0) {
    return false;
  }
  return true;
});

const calculateRightTStartScale = computed(() => {
  const rightTStart = calculateEstimatePoint.value + ((estimateTextWidth.value ?? 0) / 2);
  return rightTStart;
});

const calculateRightTEndScale = computed(() => {
  const calcRightT = (((((continuousData.value?.confMax ?? 0) - continuousData.value.rangeMin) /
    (continuousData.value.rangeMax - continuousData.value.rangeMin)) * 100) +
    ((estimateTextWidth.value ?? 0) / 2)) + (scaleXOffSetCalculation.value ?? 0);
  return calcRightT > 105 ? 105 : calcRightT;
});
</script>
