<script setup lang="ts">
import { computed } from 'vue'
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const { oxc } = await useOxc()

const sourcemapLink = computed(() => {
  let code = oxc.value.codegenText
  let map = oxc.value.codegenSourcemapText
  if (code && map) {
    // encoding url hash for
    // https://github.com/evanw/source-map-visualization/blob/f3e9dfec20e7bfd9625d03dd0d427affa74a9c43/code.js#L2004-L2023
    const utf16ToUTF8 = (x: string) => unescape(encodeURIComponent(x))
    code = utf16ToUTF8(code)
    map = utf16ToUTF8(map)
    const hash = btoa(`${code.length}\0${code}${map.length}\0${map}`)
    return `https://evanw.github.io/source-map-visualization/#${hash}`
  }
  return ''
})
</script>

<template>
  <div class="w-full flex flex-col overflow-auto">
    <OutputPreview :code="oxc.codegenText" lang="tsx" />
    <a
      v-if="sourcemapLink"
      class="group m-3 flex items-center self-start border border-[#e2e2e3]/50 rounded-lg px-3 py-2 text-sm transition-all dark:border-[#2e2e32]/50 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md dark:hover:border-blue-800/50 dark:hover:bg-blue-950/20"
      :href="sourcemapLink"
      target="_blank"
      rel="noopener"
    >
      <span
        class="text-[#3c3c43] font-medium transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
        >Visualize source map</span
      >
      <div
        class="i-ri:arrow-right-up-line ml-2 h-4 w-4 text-[#3c3c43]/[.56] transition-transform group-hover:translate-x-0.5 dark:text-[#fffff5]/[.6] group-hover:-translate-y-0.5"
      />
    </a>
  </div>
</template>
