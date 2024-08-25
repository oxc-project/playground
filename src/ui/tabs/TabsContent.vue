<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { useForwardPropsEmits, TabsContentProps, TabsContent } from "radix-vue";
import { cn } from "src/utils/cn";

const props = defineProps<
  TabsContentProps & { class?: HTMLAttributes["class"] }
>();

const emits = defineEmits();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <TabsContent :class="cn('max-h-full', props.class)" v-bind="forwarded">
    <slot />
  </TabsContent>
</template>
