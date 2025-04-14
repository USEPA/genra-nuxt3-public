<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12">
      <Accordion value="0">
        <AccordionPanel
          value="0"
          :pt="{
            root: {
              class: 'border-b-0',
            },
          }"
        >
          <AccordionHeader active>
            <h2 class="text-center">
              <strong class="underline decoration-dotted text-center">Fingerprints</strong>
            </h2>
          </AccordionHeader>
          <AccordionContent
            :pt="{
              root: {
                class: 'border-b-0',
              },
            }"
          >
            <div class="grid grid-cols-12 gap-2">
              <div
                v-for="fp in fps"
                :key="fp.key"
                class="col-span-12"
              >
                <InputGroup>
                  <ToggleSwitch
                    :model-value="fpSelections[fp.key]"
                    input-id="toggleSwitch"
                    class="min-w-[40px]"
                    @value-change="(value: boolean) => fpSelectionChangeHandler(fp.key, value)"
                  />
                  <label
                    for="toggleSwitch"
                    class="ml-2"
                  >{{ fp.name }}</label> <div
                    class="h-6 w-6 ml-2"
                    :style="`background-color: ${props.setupResponse.fpColor[fp.key]}`"
                  />
                </InputGroup>
              </div>
              <div class="col-span-6 mt-2">
                <FloatLabel
                  class="w-full"
                  variant="on"
                >
                  <Select
                    v-model="selectedGraphType"
                    input-id="graph-type-input"
                    :options="graphTypeOptions"
                    :aria-label="GRAPH_TYPE_SELECT_LABEL_TEXT"
                    option-label="name"
                    class="w-full"
                  />
                  <label for="graph-type-input">{{ GRAPH_TYPE_SELECT_LABEL_TEXT }}</label>
                </FloatLabel>
              </div>
              <div class="col-span-6 mt-2">
                <FloatLabel
                  class="w-full"
                  variant="on"
                >
                  <Select
                    v-model="selectedFilterBy"
                    input-id="filter-by-input"
                    :options="filterByOptions"
                    :aria-label="FILTER_BY_SELECT_LABEL_TEXT"
                    option-label="name"
                    class="w-full"
                  />
                  <label for="filter-by-input">{{ FILTER_BY_SELECT_LABEL_TEXT }}</label>
                </FloatLabel>
              </div>
              <div class="col-span-12 text-center">
                <Button
                  label="Update"
                  :disabled="isUpdateDisabled"
                  @click="updateHandler"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {UpdatedGraphParams} from '../types';
import {FILTER_BY_SELECT_LABEL_TEXT, GRAPH_TYPE_SELECT_LABEL_TEXT} from './constants';
import type {
  BaseItem, SetupFilterBy, SetupResponse,
} from '~/api/types';

const props = defineProps<{
  setupResponse: SetupResponse | Record<string, never>;
  updatedGraphParams: UpdatedGraphParams;
}>();

const emits = defineEmits<{
  update: [params: UpdatedGraphParams];
}>();

// Fingerprint Selections
const fps = computed(() => props.setupResponse.neighbor_by.filter(({key}) => key !== 'hybrid'));
interface FpSelection {
  [key: string]: boolean;
}
const fpSelections = ref<FpSelection>({});
const fpSelectionChangeHandler = (key: string, value: boolean) => {
  if (key in fpSelections.value) {
    fpSelections.value[key] = value;
  }
};

const convertFpSelectionsToArr = (selections: FpSelection) => Object.keys(selections).reduce((acc, cv) => {
  if (fpSelections.value[cv]) {
    acc.push(cv);
  }
  return acc;
}, [] as string[]);

onMounted(() => {
  fpSelections.value = fps.value.reduce((acc, cv) => {
    acc[cv.key] = props.setupResponse.initGraphFPs.includes(cv.key);
    return acc;
  }, {} as FpSelection);
});

// Graph Type
const selectedGraphType = ref<BaseItem>();
const graphTypeOptions = computed(() => props.setupResponse.graph_type);
onMounted(() => {
  selectedGraphType.value = props.setupResponse.graph_type[0];
});

// Filter By
const selectedFilterBy = ref<SetupFilterBy>();
const filterByOptions = computed(() => props.setupResponse.filter_by);
onMounted(() => {
  selectedFilterBy.value = props.setupResponse.filter_by[0];
});

// Update Action
const isUpdateDisabled = computed(() => {
  const hasFpSelectionsBeenAdded = convertFpSelectionsToArr(fpSelections.value)
    .some(key => !props.updatedGraphParams.fingerprints.includes(key));

  const hasOriginalSelections = props.updatedGraphParams.fingerprints.every((fp) => {
    return convertFpSelectionsToArr(fpSelections.value).includes(fp);
  });

  const hasFpSelectionsChanged = hasFpSelectionsBeenAdded || !hasOriginalSelections;

  return selectedFilterBy.value?.key === props.updatedGraphParams.filterBy &&
    selectedGraphType.value?.key === props.updatedGraphParams.graphType && !hasFpSelectionsChanged;
});

const updateHandler = () => {
  if (!isUpdateDisabled.value) {
    emits('update', {
      filterBy: selectedFilterBy.value?.key || '',
      graphType: selectedGraphType.value?.key || '',
      fingerprints: convertFpSelectionsToArr(fpSelections.value),
    });
  }
};
</script>
