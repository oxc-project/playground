<script setup lang="ts">
import { highlight, highlighterPromise, type ShikiLang } from 'src/utils/shiki'
import { computed } from 'vue'

const props = defineProps<{
  code?: string
  lang: ShikiLang
}>()

const highlighter = await highlighterPromise

const codeWithColor = computed(() => {
  if (!props.code) return ''
  return highlight(highlighter, props.code, props.lang)
})
</script>

<template>
  <div
    class="flex-1 overflow-auto text-sm leading-relaxed"
    v-html="codeWithColor"
  />
</template>
