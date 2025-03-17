<script setup lang="ts">
import { computed } from 'vue'
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const { oxc } = await useOxc()
const code = computed(() => {
  return oxc.value.symbolsJson
})
</script>

<template>
  <OutputPreview :code lang="json" />
</template>
