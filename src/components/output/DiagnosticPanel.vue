<script setup lang="ts">
import { useOxc } from '~/composables/oxc'

const { oxc } = await useOxc()
</script>

<template>
  <div
    v-for="(diag, i) in oxc.getDiagnostics()"
    :key="i"
    style="white-space: pre"
  >
    {{ diag.codeframe }}
  </div>
</template>
