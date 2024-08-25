<script setup lang="ts">
import { editorValue } from "src/composables/state";
import { PLAYGROUND_DEMO_CODE } from "src/utils/constants";
import { urlParamsInst } from "src/utils/url";
import { ref } from "vue";
import MonacoEditor from "./Monaco.vue";

defineProps(["language"]);

const editorContainer = ref(null);

const setValue = (newValue: string) => {
  editorValue.value = newValue;
  urlParamsInst.updateCode(newValue);
};

setValue(urlParamsInst.code || PLAYGROUND_DEMO_CODE);
</script>

<template>
  <div class="w-full min-w-0 py-2">
    <MonacoEditor
      ref="editorContainer"
      :language="language"
      :value="editorValue"
      @update:model-value="setValue"
    />
  </div>
</template>
