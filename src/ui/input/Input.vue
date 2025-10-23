<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { cn } from '~/utils/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    :class="
      cn(
        'flex h-10 w-full rounded-lg border-2 border-input bg-white/50 dark:bg-[#1b1b1f]/50 px-3 py-2 text-sm shadow-sm transition-all hover:border-input/80 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary focus-visible:shadow-md disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm',
        props.class,
      )
    "
  />
</template>
