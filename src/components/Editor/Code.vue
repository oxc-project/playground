<script setup lang="ts">
import { ref } from "vue";
import { useElementSize } from "@vueuse/core";
import { editorValue } from "src/composables/state";
import { PLAYGROUND_DEMO_CODE } from "src/utils";
import { urlParamsInst } from "src/utils";
import MonacoEditor from "./Monaco.vue";

defineProps(["language"]);

const editorContainer = ref(null);
const { width, height } = useElementSize(editorContainer);

const setValue = (newValue: string) => {
  editorValue.value = newValue;
  urlParamsInst.updateCode(newValue);
};

setValue(urlParamsInst.code || PLAYGROUND_DEMO_CODE);
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
