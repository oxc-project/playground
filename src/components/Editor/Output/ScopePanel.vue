<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const { oxc } = await useOxc()
</script>

<template>
  <OutputPreview :code="oxc.scopeText" lang="tsx" />
</template>
