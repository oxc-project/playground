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
    class="hidden items-center before:ml-4 before:mr-6 before:h-6 before:w-px xl:flex before:bg-gray-300 before:content-[''] dark:before:bg-gray-600"
  >
    <SwitchRoot
      v-bind="forwarded"
      v-model:checked="dark"
      role="switch"
      :class="
        cn(
          'peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          'bg-gray-200 border-gray-300 hover:bg-gray-300',
          'dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600',
          'data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500',
          'data-[state=checked]:hover:bg-blue-600 data-[state=checked]:hover:border-blue-600',
          props.class,
        )
      "
    >
      <SwitchThumb
        :class="
          cn(
            'pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-all duration-300 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
            'flex items-center justify-center',
            'bg-white dark:bg-white',
            'data-[state=checked]:bg-white dark:data-[state=checked]:bg-white',
          )
        "
      >
        <div 
          :class="[
            dark ? 'i-ri:moon-line text-blue-600' : 'i-ri:sun-line text-yellow-500',
            'scale-75 transition-all duration-300'
          ]" 
        />
      </SwitchThumb>
    </SwitchRoot>
    <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ dark ? 'Dark' : 'Light' }}
    </span>
  </div>
</template>
