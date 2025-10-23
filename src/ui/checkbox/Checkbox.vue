<script setup lang="ts">
import { CheckIcon } from '@radix-icons/vue'
import {
  CheckboxIndicator,
  CheckboxRoot,
  useForwardPropsEmits,
  type CheckboxRootEmits,
  type CheckboxRootProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

const props = defineProps<
  CheckboxRootProps & { class?: HTMLAttributes['class'] }
>()
const emits = defineEmits<CheckboxRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn(
        'peer h-4.5 w-4.5 shrink-0 rounded-md border-2 border-primary shadow-sm transition-all hover:shadow-md hover:border-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-500 data-[state=checked]:to-blue-600 dark:data-[state=checked]:from-blue-600 dark:data-[state=checked]:to-blue-700 data-[state=checked]:text-white data-[state=checked]:border-transparent data-[state=checked]:shadow-md data-[state=checked]:scale-105',
        props.class,
      )
    "
  >
    <CheckboxIndicator
      class="h-full w-full flex scale-0 items-center justify-center text-current transition-transform data-[state=checked]:scale-100"
    >
      <slot>
        <CheckIcon class="h-3.5 w-3.5 font-bold" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
