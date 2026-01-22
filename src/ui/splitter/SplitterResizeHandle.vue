<script setup lang="ts">
import {
  SplitterResizeHandle,
  useForwardPropsEmits,
  type SplitterResizeHandleEmits,
  type SplitterResizeHandleProps,
} from "radix-vue";
import { computed } from "vue";
import { cn } from "~/utils/cn";

const props = withDefaults(
  defineProps<
    SplitterResizeHandleProps & {
      withHandle?: boolean;
      class?: string;
    }
  >(),
  {
    withHandle: false,
  },
);
const emits = defineEmits<SplitterResizeHandleEmits>();

const delegatedProps = computed(() => {
  const { class: _, withHandle: __, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SplitterResizeHandle
    v-bind="forwarded"
    :class="
      cn(
        'relative flex w-px items-center justify-center bg-[#e2e2e3] after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90 dark:bg-[#2e2e32]',
        props.class,
      )
    "
  >
    <div
      v-if="withHandle"
      class="z-10 h-4 w-3 flex items-center justify-center border rounded-sm bg-border"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-2.5 w-2.5"
      >
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="19" r="1" />
      </svg>
    </div>
    <slot />
  </SplitterResizeHandle>
</template>
