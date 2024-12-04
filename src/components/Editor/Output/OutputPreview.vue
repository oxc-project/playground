<script setup lang="ts">
import CopyContainer from 'src/components/Editor/CopyContainer.vue'
import { highlight, highlighter, type ShikiLang } from 'src/utils/shiki'
import { computed } from 'vue'

const props = defineProps<{
  code?: string
  lang: ShikiLang
}>()

const codeWithColor = computed(() => {
  if (!props.code) return ''
  return highlight(highlighter, props.code, props.lang)
})
</script>

<template>
  <CopyContainer :value="code || ''" class="min-w-0 w-full flex">
    <div
      class="flex-1 overflow-auto text-sm leading-relaxed"
      v-html="codeWithColor"
    />
  </CopyContainer>
</template>
