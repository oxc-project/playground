<script setup lang="ts">
import { ref } from "vue";
import { useElementSize } from "@vueuse/core";
import MonacoEditor from "./Monaco.vue";
import { useEditorValue } from "src/composable/useEditorValue";

defineProps(["language"]);

const editorContainer = ref(null);
const { width, height } = useElementSize(editorContainer);
const editorValue = useEditorValue();
const setValue = (newValue: string) => {
  editorValue.value = newValue;
};
</script>

<template>
  <div class="w-1/2 h-full py-2">
    <MonacoEditor
      ref="editorContainer"
      :language="language"
      :width="width"
      :height="height"
      @update:model-value="setValue"
      :value="editorValue"
    />
  </div>
</template>
