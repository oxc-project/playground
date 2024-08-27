<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Button } from 'src/ui/button'
import { highlight, highlighterPromise, type ShikiLang } from 'src/utils/shiki'
import { computed } from 'vue'

const props = defineProps<{
  code?: string
  lang: ShikiLang
}>()

const { copied, copy } = useClipboard()

const highlighter = await highlighterPromise

const codeWithColor = computed(() => {
  if (!props.code) return ''
  return highlight(highlighter, props.code, props.lang)
})

function handleCopy() {
  copy(props.code || '')
}
</script>

<template>
  <div class="group relative min-w-0 w-full flex">
    <div
      class="flex-1 overflow-auto text-sm leading-relaxed"
      v-html="codeWithColor"
    />
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
