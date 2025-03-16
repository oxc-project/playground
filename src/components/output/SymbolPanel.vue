<script setup lang="ts">
import { computed } from 'vue'
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const { oxc } = await useOxc()
const code = computed(() => {
  return oxc.value.symbolsJson
})
// const symbols = computed(() => {
//   return JSON.parse(oxc.value.symbolsJson)
// })
// const code = computed(() => JSON.stringify(symbols.value, undefined, 2))
</script>

<template>
  <OutputPreview :code lang="json" />
</template>
