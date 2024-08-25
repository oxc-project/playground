<script setup lang="ts">
import { SelectSeparator, type SelectSeparatorProps } from "radix-vue";
import { cn } from "src/utils/cn";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  SelectSeparatorProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <SelectSeparator
    v-bind="delegatedProps"
    :class="cn('-mx-1 my-1 h-px bg-muted', props.class)"
  />
</template>
