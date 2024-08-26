<script setup lang="ts">
import { editorValue } from "src/composables/state";
import { ref } from "vue";
import MonacoEditor from "./Monaco.vue";

defineProps<{
  language: string;
}>();

const editorContainer = ref(null);

const setValue = (newValue: string) => {
  editorValue.value = newValue;
};
</script>

<template>
  <div class="flex-1 min-w-0 py-2">
    <MonacoEditor
      ref="editorContainer"
      :language="language"
      :value="editorValue"
      @update:model-value="setValue"
    />
  </div>
</template>
