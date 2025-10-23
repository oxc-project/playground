<script setup lang="ts">
import { useOxc } from '~/composables/oxc'

const { oxc } = await useOxc()
</script>

<template>
  <div
    v-for="(diag, i) in oxc.getDiagnostics()"
    :key="i"
    class="mb-3 border-l-4 border-amber-500 rounded-lg bg-amber-50/50 p-3 shadow-sm transition-shadow dark:border-amber-600 dark:bg-amber-950/20 hover:shadow-md"
    style="white-space: pre"
  >
    {{ diag.codeframe }}
  </div>
</template>
