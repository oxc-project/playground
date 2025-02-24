<script setup lang="ts">
import { computed } from 'vue'
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const { oxc } = await useOxc()

const sourcemapLink = computed(() => {
  const code = oxc.value.codegenText
  const map = oxc.value.codegenSourcemapText
  if (code && map) {
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
      class="m-2 flex items-center self-start text-sm opacity-80"
      :href="sourcemapLink"
      target="_blank"
      rel="noopener"
    >
      <span
        class="text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
        >Visualize source map</span
      >
      <div
        class="i-ri:arrow-right-up-line ml-1 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6]"
      />
    </a>
  </div>
</template>
