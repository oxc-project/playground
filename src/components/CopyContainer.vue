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
      class="absolute right-4 top-4 op0 transition-opacity group-hover:opacity-100"
      @click="handleCopy"
    >
      <div
        :class="copied ? 'i-ri:check-line text-green' : 'i-ri:file-copy-line'"
      />
    </Button>
  </div>
</template>
