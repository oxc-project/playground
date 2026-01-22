<script setup lang="ts">
import {
  SplitterPanel,
  useForwardPropsEmits,
  type SplitterPanelEmits,
  type SplitterPanelProps,
} from "radix-vue";

const props = defineProps<SplitterPanelProps>();
const emits = defineEmits<SplitterPanelEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <SplitterPanel v-bind="forwarded">
    <slot />
  </SplitterPanel>
</template>
