<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { SelectScrollUpButton, useForwardProps, type SelectScrollUpButtonProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/utils/cn";

const props = defineProps<SelectScrollUpButtonProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectScrollUpButton
    v-bind="forwardedProps"
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)"
  >
    <slot>
      <Icon icon="radix-icons:chevron-up" />
    </slot>
  </SelectScrollUpButton>
</template>
