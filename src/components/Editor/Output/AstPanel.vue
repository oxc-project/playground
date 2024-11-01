<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'
import { computed } from 'vue'
import OutputPreview from './OutputPreview.vue'

const { oxc } = await useOxc()
const code = computed(() => {
  const comments = oxc.value.getComments()
  const errors = oxc.value.getDiagnostics()
  const program = oxc.value.ast
  return JSON.stringify({ program, comments, errors }, undefined, 2)
})
</script>

<template>
  <OutputPreview :code lang="json" />
</template>
