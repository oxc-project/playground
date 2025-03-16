<script setup lang="ts">
import { useOxc } from '~/composables/oxc'

const { oxc } = await useOxc()
</script>

<template>
  <div v-for="(diag, i) in oxc.getDiagnostics2()" :key="i">
    {{ diag.severity }}: {{ diag.message }}
  </div>
</template>
