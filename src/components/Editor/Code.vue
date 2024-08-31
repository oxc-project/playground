<script setup lang="ts">
import { editorValue } from 'src/composables/state'
import Monaco from './Monaco.vue'

defineProps<{
  language: string
  filename: string
}>()
</script>

<template>
  <Monaco v-model="editorValue" :language="language" :filename />
</template>
