<template>
  <div class="grid grid-cols-12 border-b">
    <div class="col-span-12">
      <Accordion id="custom-ne-accordion">
        <AccordionPanel value="0">
          <AccordionHeader
            id="custom-ne-accordion-header"
            aria-label="Custom Neighborhood"
          >
            <h2 class="text-center">
              <strong class="underline decoration-dotted text-center">Custom Neighborhood</strong>
            </h2>
          </AccordionHeader>
          <AccordionContent
            :pt="{
              root: {
                'aria-label': 'Custom Neighborhood Content',
                'aria-labelledby': 'custom-ne-accordion-header',
              },
            }"
          >
            <div
              v-if="props.selectedNode"
              class="grid grid-cols-12 gap-2"
            >
              <div class="col-span-12 col-start-3">
                <Button
                  v-tooltip="`Add ${props.selectedNode.name}`"
                  :aria-label="`add ${props.selectedNode.name} to custom neighborhood`"
                  size="small"
                  icon="pi pi-plus-circle"
                  :disabled="isAddDisabled"
                  :label="`Add ${getStrWithEllipsis(props.selectedNode.name, 13)}`"
                  @click="addHandler"
                />
              </div>

              <div class="col-span-2">
                <Button
                  v-tooltip="selectedCustomChemical
                    ? `Click to remove ${selectedCustomChemical.name} from custom neighborhood` : ''"
                  :aria-label="`remove ${props.selectedNode.name} from custom neighborhood`"
                  size="small"
                  icon="pi pi-minus-circle"
                  severity="danger"
                  :disabled="isRemoveDisabled"
                  variant="text"
                  @click="removeHandler"
                />
              </div>
              <div class="col-span-10 card flex justify-center">
                <Listbox
                  v-model="selectedCustomChemical"
                  :options="addedCustomChemicals"
                  option-label="name"
                  class="w-full"
                  scroll-height="8rem"
                  :empty-selection-message="'none'"
                  :pt="{
                    emptyMessage: {
                      'aria-label': 'No available options',
                    },
                    list: {
                      'aria-label': 'Custom Neighborhood',
                    },
                  }"
                />
              </div>

              <div class="col-span-12 text-center">
                <Button
                  v-tooltip="NE_EXPLORER_RUN_CUSTOM_BTN_TOOLTIP"
                  label="GenRA"
                  size="small"
                  class="ml-1 bg-green-700 border-green-700"
                  severity="success"
                  color="#178740"
                  icon="pi pi-play-circle"
                  :disabled="isRunDisabled"
                  @click="runGenra"
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
import type {ForceGraphNode} from '../types';
import {NE_EXPLORER_RUN_CUSTOM_BTN_TOOLTIP} from './constants';

const props = defineProps<{
  selectedNode: ForceGraphNode | null;
}>();

const emits = defineEmits<{
  startGenraFromNe: [chemId: string[]];
}>();

const addedCustomChemicals = ref<ForceGraphNode[]>([]);

const selectedCustomChemical = ref<ForceGraphNode | null>();

// Add
const addHandler = () => {
  if (props.selectedNode && !isAddDisabled.value) {
    addedCustomChemicals.value.push(props.selectedNode);
  }
};

const isAddDisabled = computed(() => addedCustomChemicals.value.some(({id}) => props.selectedNode?.id === id) ||
  props.selectedNode?.isTarget);

// Remove
const isRemoveDisabled = computed(() => !selectedCustomChemical.value);

const removeHandler = () => {
  if (!isRemoveDisabled.value) {
    addedCustomChemicals.value = addedCustomChemicals.value.filter(({id}) => id !== selectedCustomChemical.value?.id);
    selectedCustomChemical.value = null;
  }
};

// Run
const isRunDisabled = computed(() => !addedCustomChemicals.value.length);
const runGenra = () => {
  if (!isRunDisabled.value) {
    emits('startGenraFromNe', addedCustomChemicals.value.map(({id}) => id));
  }
};
</script>
