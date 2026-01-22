<script setup lang="ts">
import {
  RadioGroupRoot,
  useForwardPropsEmits,
  type RadioGroupRootEmits,
  type RadioGroupRootProps,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/utils/cn";

const props = defineProps<RadioGroupRootProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<RadioGroupRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <RadioGroupRoot :class="cn('grid gap-2', props.class)" v-bind="forwarded">
    <slot />
  </RadioGroupRoot>
</template>
