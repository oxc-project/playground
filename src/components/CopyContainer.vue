<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Button } from '~/ui/button'
import { cn } from '~/utils/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  value: string
  class?: HTMLAttributes['class']
}>()
const { copied, copy } = useClipboard()

function handleCopy() {
  copy(props.value || '')
}
</script>

<template>
  <div :class="cn('group relative h-full', props.class)">
    <slot />
    <Button
      variant="ghost"
      size="sm"
      class="absolute right-4 top-4 border border-[#e2e2e3] bg-white/80 opacity-0 shadow-lg backdrop-blur-sm transition-all dark:border-[#2e2e32] dark:bg-[#1b1b1f]/80 group-hover:opacity-100 hover:shadow-xl"
      @click="handleCopy"
    >
      <div
        :class="
          copied
            ? 'i-ri:check-line text-green-500'
            : 'i-ri:file-copy-line text-blue-500 dark:text-blue-400'
        "
      />
    </Button>
  </div>
</template>
