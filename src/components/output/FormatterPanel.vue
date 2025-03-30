<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const { oxc } = await useOxc()
</script>

<template>
  <OutputPreview :code="oxc.formatterIrText" lang="tsx" />
</template>
