<template>
  <Popover
    ref="showHybridFpOverlayRef"
    class="w-80"
    :dismissable="false"
    data-testid="hybridFpPopover"
    :pt="{
      content: {
        class: 'p-0',
      },
    }"
    @hide="overlayHideHandler"
    @show="overlayShowHandler"
  >
    <Card>
      <template #title>
        {{ HYBRID_FP_LABEL_TEXT }}
      </template>
      <template #content>
        <div>
          <transition-group name="fade">
            <div
              v-for="(option, idx) in hybridOptions"
              :key="option.key"
              class="grid grid-cols-12 gap-2 mt-2"
            >
              <div
                :key="`${option.key}1`"
                class="col-span-2"
              >
                <Button
                  :key="`${option.key}2`"
                  icon="pi pi-times-circle"
                  aria-label="Remove"
                  severity="danger"
                  variant="text"
                  @click="removeHybridFpOptionHandler(idx)"
                />
              </div>
              <div
                :key="!option.key ? `${option.key}3` : `${option.key}36`"
                class="col-span-10"
              >
                <Select
                  :key="!option.key ? `${option.key}33` : `${option.key}333`"
                  :model-value="selectedFp(idx)"
                  :options="selectOptions"
                  :option-disabled="(ev: HybridFpOption) => selectedFpOptionDisabled(ev, idx)"
                  option-value="key"
                  option-label="name"
                  class="mb-2"
                  size="small"
                  fluid
                  @change="(ev) => selectedFpChangeHandler(ev, idx)"
                />
              </div>
              <div
                :key="`${option.key}4`"
                class="col-span-12 mb-2 text-center"
              >
                <Slider
                  :key="`${option.key}44`"
                  :model-value="option.weight"
                  :min="1"
                  input-id="fp-weight-slider"
                  :max="12"
                  class="mb-2"
                  :aria-label="`${option.name} FP Weight Slider`"
                  @change="(ev) => weightSliderChangeHandler(ev, idx)"
                />
                <label
                  :key="`${option.key}45`"
                  for="fp-weight-slider"
                >Weight: {{ option.weight }}</label>
              </div>
              <div
                v-if="idx !== 2"
                :key="`${option.key}46`"
                class="border-b border-gray-300 col-span-12"
              />
            </div>
          </transition-group>
          <div :class="`col-span-12 mt-2 ${hybridOptions.length > 0 ? 'border-b border-gray-300' : ''}`">
            <Select
              v-if="!isSelectionsMaxed"
              ref="selectOptionRef"
              v-model:model-value="selectOption"
              class="mb-2"
              :options="selectOptions"
              :option-disabled="optionDisabled"
              option-label="name"
              :placeholder="HYBRID_FP_ADD_FP_PLACEHOLDER_TEXT"
              size="small"
              fluid
            />
          </div>
          <div class="grid grid-cols-12 mt-4">
            <span
              v-for="(option, idx) in hybridOptions"
              :key="option.key"
              :class="`col-span-12 ${idx === 0 ? 'mt-2' : ''}`"
            >
              {{ option.name }}: {{ getFpWeightDistribution(option.weight) }}%
            </span>
          </div>
        </div>
      </template>
      <template #footer>
        <Button
          size="small"
          severity="secondary"
          @click="showHybridFpOverlayRef?.hide()"
        >
          Close
        </Button>
        <Button
          size="small"
          class="ml-2"
          :disabled="isSubmitDisabled"
          @click="submit"
        >
          Submit
        </Button>
      </template>
    </Card>
  </Popover>
</template>

<script setup lang="ts">
import type {Popover, SelectChangeEvent} from 'primevue';
import type {HybridFpOption} from '../types';
import {HYBRID_FP_LABEL_TEXT, HYBRID_FP_ADD_FP_PLACEHOLDER_TEXT} from './constants';
import type {BaseItem} from '~/api/types';

const props = defineProps<{
  neighborByOptions: BaseItem[];
  fp: string;
  weight: string | undefined;
  isHybridFp: boolean;
}>();

const emits = defineEmits<{
  onHybridPopoverClose: [];
  hybridFpChange: [hybridFps: HybridFpOption[]];

}>();

const showHybridFpOverlayRef = ref<InstanceType<typeof Popover> & {
  visible: boolean;
}>();

const overlayHideHandler = () => {
  emits('onHybridPopoverClose');
};

const overlayShowHandler = () => {
  // fill previous selections
  if (props.isHybridFp && props.weight) {
    const fps = props.fp.split(',');
    const weights = props.weight.split(',');
    hybridOptions.value = fps.reduce((acc, cv, idx) => {
      const option = selectOptions.value.find(({key}) => key === cv);
      if (option) {
        acc.push({
          ...option,
          weight: weights?.[idx] ? Number.parseInt(weights[idx], 10) : 1,
        });
      }
      return acc;
    }, [] as HybridFpOption[]);
  }
};

const isSubmitDisabled = computed(() => !hybridOptions.value.length);

const submit = () => {
  emits('hybridFpChange', hybridOptions.value);
  showHybridFpOverlayRef?.value?.hide();
};

// Select an option
const selectOptionRef = ref();

const isSelectionsMaxed = computed(() => hybridOptions.value.length >= 3);

const selectOptions = computed(() => props.neighborByOptions.filter(({key}) => key !== 'hybrid'));
const optionDisabled = (ev: HybridFpOption) => {
  return hybridOptions.value.map(({key}) => key.toLowerCase()).includes(ev.key.toLowerCase());
};
const selectOption = ref<BaseItem | null>(null);
watch(selectOption, (newVal: BaseItem | null) => {
  if (newVal) {
    addHybridFp(newVal);
    selectOption.value = null;
    selectOptionRef.value?.updateModel();
  }
});

const addHybridFp = (item: BaseItem) => {
  if (!isSelectionsMaxed.value) {
    hybridOptions.value.push({
      ...item,
      weight: 1,
    });
  }
};

// Hybrid fp select option(s)
const hybridOptions = ref<HybridFpOption[]>([]);
const selectedFp = (idx: number) => {
  return hybridOptions.value[idx]!.key;
};

const removeHybridFpOptionHandler = (idx: number) => {
  hybridOptions.value.splice(idx, 1);
};

const selectedFpOptionDisabled = (ev: HybridFpOption, idx: number) => hybridOptions.value
  .filter((_option, index) => idx !== index)
  .map(({key: hybridKey}) => hybridKey.toLowerCase())
  .includes(ev.key.toLowerCase());

const selectedFpChangeHandler = (ev: SelectChangeEvent, idx: number) => {
  // Dont do anything if change is same as existing selection
  if (hybridOptions.value[idx]?.key === ev.value) {
    return;
  }
  const updatedFp = selectOptions.value.find(({key}) => key === ev.value);
  if (updatedFp) {
    hybridOptions.value[idx] = {
      ...updatedFp,
      weight: 1,
    };
  }
};

const weightSliderChangeHandler = (weight: number, idx: number) => {
  if (hybridOptions.value[idx]) {
    hybridOptions.value[idx].weight = weight;
  }
};

// Weight distribution percentages
const getFpWeightDistribution = (weight: number) => {
  const totalSum = hybridOptions.value.reduce((acc, cv) => acc + cv.weight, 0);
  return `${Math.round((weight / totalSum) * 100)}`;
};

defineExpose({
  showHybridFpOverlayRef,
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
