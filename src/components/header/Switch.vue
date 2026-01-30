<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  SwitchRoot,
  SwitchThumb,
  useForwardPropsEmits,
  type SwitchRootEmits,
  type SwitchRootProps,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { dark } from "~/composables/state";
import { cn } from "~/utils/cn";

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<SwitchRootEmits>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <div
    class="hidden items-center before:ml-2 before:mr-4 before:h-6 before:w-px xl:flex before:bg-[#E5E4E7] before:content-[''] dark:before:bg-[#3B3440]"
  >
    <SwitchRoot
      v-bind="forwarded"
      v-model:checked="dark"
      role="switch"
      :class="
        cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-[#E5E4E7] dark:bg-[#3B3440] border border-[#E5E4E7] dark:border-[#3B3440] hover:border-[#0d6a73] dark:hover:border-[#32F3E9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
        )
      "
    >
      <SwitchThumb
        :class="
          cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-white dark:bg-[#16171d] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
            'flex items-center justify-center',
          )
        "
      >
        <Icon :icon="dark ? 'ri:moon-line' : 'ri:sun-line'" class="scale-[0.7]" />
      </SwitchThumb>
    </SwitchRoot>
  </div>
</template>
