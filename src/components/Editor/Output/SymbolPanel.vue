<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import { computed } from 'vue'
import OutputPreview from './OutputPreview.vue'

const { oxc } = await useOxc()
const symbols = computed(() => {
  return oxc.value.symbols
})
const code = computed(() => JSON.stringify(symbols.value, undefined, 2))
</script>

<template>
  <OutputPreview :code lang="json" />
</template>
