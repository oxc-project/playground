<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { NavigationMenuTrigger, useForwardProps, type NavigationMenuTriggerProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/utils/cn";
import { navigationMenuTriggerStyle } from ".";

const props = defineProps<NavigationMenuTriggerProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <NavigationMenuTrigger
    v-bind="forwardedProps"
    :class="cn(navigationMenuTriggerStyle(), 'group', props.class)"
  >
    <slot />
    <Icon
      icon="radix-icons:chevron-down"
      class="relative top-px ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuTrigger>
</template>
