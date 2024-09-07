<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'

const { oxc } = await useOxc()
</script>

<template>
  <div v-for="(diag, i) in oxc.getDiagnostics()" :key="i">
    {{ diag.severity }}: {{ diag.message }}
  </div>
</template>
