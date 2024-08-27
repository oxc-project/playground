<script setup lang="ts">
import {
  TabsTrigger,
  useForwardPropsEmits,
  type TabsTriggerProps,
} from 'radix-vue'
import { cn } from 'src/utils/cn'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
  TabsTriggerProps & { class?: HTMLAttributes['class'] }
>()

const emit = defineEmits([])
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
const forwarded = useForwardPropsEmits(delegatedProps, emit)

const classname = cn(
  'px-3 py-2 border-2 rounded-md text-sm',
  'bg-white dark:bg-[#2e2e32]',
  'hover:border-[#3451b2] dark:hover:border-[#a8b1ff]',
  'aria-selected:bg-[#3451b2] dark:aria-selected:bg-[#a8b1ff]',
  'aria-selected:border-[#3451b2] dark:aria-selected:border-[#a8b1ff]',
  'aria-selected:text-white dark:aria-selected:text-white',
  props.class,
)
</script>

<template>
  <TabsTrigger :class="classname" v-bind="forwarded">
    <slot />
  </TabsTrigger>
</template>
