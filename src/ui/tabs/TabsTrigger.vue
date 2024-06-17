<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import {
  // SwitchRoot,
  // type SwitchRootEmits,
  // type SwitchRootProps,
  // SwitchThumb,
  useForwardPropsEmits,
  TabsTrigger,
  TabsIndicator,
  TabsTriggerProps,
} from "radix-vue";
import { cn } from "src/utils";

const props = defineProps<
  TabsTriggerProps & { class?: HTMLAttributes["class"] }
>();

const emits = defineEmits();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const classname = cn(
  "px-3 py-2 border-2 rounded-md text-sm",
  "bg-white dark:bg-[#2e2e32]",
  "hover:border-[#3451b2] dark:hover:border-[#a8b1ff]",
  "aria-selected:bg-[#3451b2] dark:aria-selected:bg-[#a8b1ff]",
  "aria-selected:border-[#3451b2] dark:aria-selected:border-[#a8b1ff]",
  "aria-selected:text-white dark:aria-selected:text-white",
  props.class,
);
</script>

<template>
  <TabsTrigger :class="classname" v-bind="forwarded">
    <slot />
  </TabsTrigger>
</template>
