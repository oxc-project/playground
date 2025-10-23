<script setup lang="ts">
import {
  SwitchRoot,
  SwitchThumb,
  useForwardPropsEmits,
  type SwitchRootEmits,
  type SwitchRootProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { dark } from '~/composables/state'
import { cn } from '~/utils/cn'

const props = defineProps<
  SwitchRootProps & { class?: HTMLAttributes['class'] }
>()
const emits = defineEmits<SwitchRootEmits>()
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <div
    class="hidden items-center before:ml-2 before:mr-4 before:h-6 before:w-px xl:flex before:bg-[#e2e2e3] before:content-[''] dark:before:bg-[#2e2e32]"
  >
    <SwitchRoot
      v-bind="forwarded"
      v-model:checked="dark"
      role="switch"
      :class="
        cn(
          'peer inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/40 dark:to-purple-950/40 border-2 border-[#c2c2c4] dark:border-[#3c3f44] hover:border-[#a8b1ff] dark:hover:border-[#a8b1ff] transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
        )
      "
    >
      <SwitchThumb
        :class="
          cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-gradient-to-br from-white to-blue-50 dark:from-[#1b1b1f] dark:to-blue-950/50 shadow-lg ring-2 ring-white/20 transition-all data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1',
            'flex items-center justify-center',
          )
        "
      >
        <div
          :class="
            dark
              ? 'i-ri:moon-line text-blue-400'
              : 'i-ri:sun-line text-amber-500'
          "
          class="scale-75 transition-all"
        />
      </SwitchThumb>
    </SwitchRoot>
  </div>
</template>
