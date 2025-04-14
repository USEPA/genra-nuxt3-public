<template>
  <Button
    v-tooltip="`Click to see instructional information about ${currentHelpTextObj?.helpTextId}`"
    icon="pi pi-info-circle"
    aria-label="Help Icon"
    size="large"
    variant="text"
    class="!w-full"
    @click="showHelpText"
  />
  <Popover
    ref="op"
    aria-label="Help Dialog"
  >
    <div
      class="w-fit h-fit max-w-[560px]"
      autoFocus
    >
      <span v-html="helpText" />
    </div>
  </Popover>
</template>

<script setup lang="ts">
import type {HelpKey} from './constants';

const props = defineProps<{
  helpKey: HelpKey;
}>();

const {setupResponse} = storeToRefs(useAppBaseStore());

const op = ref();

const currentHelpTextObj = computed(() => setupResponse.value.help_text
  .find(({helpTextId}) => helpTextId.toLowerCase() === props.helpKey.toLowerCase()));

const helpText = computed(() => currentHelpTextObj.value?.helpText);

const showHelpText = (event: MouseEvent) => {
  op.value.toggle(event);
};
</script>
