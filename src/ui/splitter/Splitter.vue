<script setup lang="ts">
import {
  SplitterGroup,
  useForwardPropsEmits,
  type SplitterGroupEmits,
  type SplitterGroupProps,
} from 'radix-vue'

const props = defineProps<SplitterGroupProps>()
const emits = defineEmits<SplitterGroupEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SplitterGroup v-bind="forwarded">
    <slot />
  </SplitterGroup>
</template>
