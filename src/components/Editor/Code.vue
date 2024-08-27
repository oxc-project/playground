<script setup lang="ts">
import { editorValue } from "src/composables/state";
import { ref } from "vue";
import MonacoEditor from "./Monaco.vue";

defineProps<{
  language: string;
}>();
</script>

<template>
  <div class="flex-1 min-w-0 py-2">
    <MonacoEditor v-model="editorValue" :language="language" />
  </div>
</template>
