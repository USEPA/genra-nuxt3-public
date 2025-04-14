<template>
  <section
    role="navigation"
    class="grid stepper-container m-1 max-h-[135px] min-h-[135px]"
  >
    <div class="stepper grid-cols-12 w-full mt-0">
      <Button
        v-for="(step, idx) in steps"
        :key="step"
        v-tooltip="steps[idx]"
        :disabled="isStepperStepDisabled(idx)"
        :aria-label="steps[idx]"
        size="small"
        :class="`step flex justify-center items-center grow mt-0 grid-cols-3
        ${isStepperStepDisabled(idx) ? '!cursor-not-allowed' :''}`"
        @click="stepperClickHandler(idx)"
      >
        <div
          class="genra-step !w-full"
          :class="{ active: props.currentStep >= idx }"
        />
      </Button>
    </div>
    <div class="grid-cols-12 text-center text-white font-bold text-xl mb-1">
      <span>{{ steps[props.currentStep] }}</span>
    </div>
    <div
      v-if="isTargetDialogVisible"
      class="grid-cols-12 text-center text-white font-bold text-xl mb-2"
    >
      <Button
        label="Target Chemical"
        icon="pi pi-info-circle"
        size="small"
        @click="showTargetDialog = true"
      />
    </div>
    <TargetChemicalDialog
      :show="showTargetDialog"
      @close-dialog="showTargetDialog = false"
    />
  </section>
</template>

<script setup lang="ts">
import TargetChemicalDialog from './TargetChemicalDialog.vue';
import {steps} from '#imports';

const props = defineProps<{
  currentStep: number;
}>();

const inactiveStepColor = ref('#eee');
const activeStepColor = ref('#ffb800');

const isStepperStepDisabled = (stepClicked: number) => stepClicked > props.currentStep;

const {setStep} = useAppBaseStore();

const stepperClickHandler = (stepClicked: number) => {
  if (!isStepperStepDisabled(stepClicked)) {
    setStep(stepClicked);
  }
};

// Target Chemical Dialog
const isTargetDialogVisible = computed(() => props.currentStep >= 1);

const showTargetDialog = ref(false);
</script>

<style scoped>
.stepper-container {
  height: auto;
  background: #0e6993;
  border: 1px solid black;
}
.stepper {
  z-index: 5;
  display: flex;
  justify-content: space-around;
}
.step {
  flex-flow: row nowrap;
}
.genra-step {
  background-color: v-bind(inactiveStepColor);
  height: 30px !important;
  margin: 10px 2em;
  position: relative;
  transition: filter 1s, background-color 1s;
}
.genra-step:before {
  content: '';
  width: 0;
  height: 30px;
  border-top: 15px solid v-bind(inactiveStepColor);
  border-left: 20px solid transparent;
  border-right: 20px solid v-bind(inactiveStepColor);
  border-bottom: 15px solid v-bind(inactiveStepColor);
  position: absolute;
  left: -20px;
  top: 0;
  transition: filter 1s, border-color 1s;
}
.genra-step:after {
  content: '';
  width: 0;
  height: 30px;
  border-top: 15px solid transparent;
  border-left: 20px solid v-bind(inactiveStepColor);
  border-bottom: 15px solid transparent;
  position: absolute;
  right: -20px;
  top: 0;
  transition: filter 1s, border-color 1s;
}
.genra-step.active {
  background-color: v-bind(activeStepColor);
  filter: drop-shadow(6px 6px 3px #003350);
}
.genra-step.active:before {
  border-top-color: v-bind(activeStepColor);
  border-right-color: v-bind(activeStepColor);
  border-bottom-color: v-bind(activeStepColor);
}
.genra-step.active:after {
  border-left-color: v-bind(activeStepColor);
}
</style>
