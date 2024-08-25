<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import {
  type SwitchRootProps,
  type SwitchRootEmits,
  SwitchRoot,
  SwitchThumb,
  useForwardPropsEmits,
} from "radix-vue";
import { useDark, useToggle } from "@vueuse/core";
import { cn } from "src/utils/cn";

const props = defineProps<
  SwitchRootProps & { class?: HTMLAttributes["class"] }
>();
const emits = defineEmits<SwitchRootEmits>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div
    class="hidden xl:flex items-center before:content-[''] before:w-px before:h-6 before:ml-2 before:mr-4 before:bg-[#e2e2e3] dark:before:bg-[#2e2e32]"
  >
    <SwitchRoot
      @click="toggleDark()"
      v-bind="forwarded"
      v-model:checked="isDark"
      role="switch"
      :class="
        cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-[#8e96aa]/[.16] dark:bg-[#657585]/[.16] border border-[#c2c2c4] dark:border-[#3c3f44] hover:border-[#a8b1ff] dark:hover:border-[#a8b1ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
        )
      "
    >
      <SwitchThumb
        :class="
          cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-white dark:bg-[#1b1b1f] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
          )
        "
      />
    </SwitchRoot>
  </div>
</template>
