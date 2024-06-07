<script setup lang="ts">
import { ref } from "vue";
import { useElementSize } from "@vueuse/core";
import MonacoEditor from "./Monaco.vue";

defineProps(["language"]);

const editorContainer = ref(null);
const { width, height } = useElementSize(editorContainer);
</script>

<template>
  <div class="w-1/2 h-full py-2">
    <MonacoEditor
      ref="editorContainer"
      :language="language"
      :width="width"
      :height="height"
    />
  </div>
</template>
