<script setup lang="ts">
import {
  TabsContent,
  useForwardPropsEmits,
  type TabsContentProps,
} from "radix-vue";
import { cn } from "src/utils/cn";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  TabsContentProps & { class?: HTMLAttributes["class"] }
>();

const emits = defineEmits([]);
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <TabsContent :class="cn(props.class, 'flex max-h-full')" v-bind="forwarded">
    <slot />
  </TabsContent>
</template>
