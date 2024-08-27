<script setup lang="ts">
import { editorValue } from 'src/composables/state'
import Monaco from './Monaco.vue'

defineProps<{
  language: string
  filename: string
}>()
</script>

<template>
  <div class="min-w-0 flex-1 py-2">
    <Monaco v-model="editorValue" :language="language" :filename />
  </div>
</template>
