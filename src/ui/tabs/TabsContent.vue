<script setup lang="ts">
import { TabsContent, type TabsContentProps } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/utils/cn";

const props = defineProps<TabsContentProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsContent :class="cn('h-full', props.class)" v-bind="delegatedProps">
    <div
      class="mt-0 h-full flex flex-col overflow-hidden ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
    >
      <slot />
    </div>
  </TabsContent>
</template>
