<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'

const { oxc } = await useOxc()
</script>

<template>
  <div v-for="d in oxc.getDiagnostics()" :key="d.message">
    {{ d.severity }}: {{ d.message }}
  </div>
</template>
