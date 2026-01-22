<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { SelectIcon, SelectTrigger, useForwardProps, type SelectTriggerProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/utils/cn";

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start',
        props.class,
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <Icon icon="radix-icons:caret-sort" class="h-4 w-4 shrink-0 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
