<script setup lang="ts">
import * as monaco from "monaco-editor";
import { computed, ref, useTemplateRef, watchEffect } from "vue";
import { useOxc } from "~/composables/oxc";
import { editorValue } from "~/composables/state";
import MonacoEditor from "../MonacoEditor.vue";

defineProps<{
  language: string;
  filename: string;
  main?: boolean;
}>();

const { oxc } = await useOxc();

const monacoRef = useTemplateRef("monacoRef");
const getPositionAt = computed(() => monacoRef.value?.getPositionAt);
const markers = ref<monaco.editor.IMarkerData[]>([]);

watchEffect(() => {
  const getPos = getPositionAt.value;
  if (!getPos) return;

  const diagnostics = oxc.value.getDiagnostics();
  markers.value = diagnostics.map((d) => {
    const startPos = getPos(d.labels[0]?.start ?? 0);
    const endPos = getPos(d.labels[0]?.end ?? 0);
    return {
      severity:
        d.severity === "Warning" ? monaco.MarkerSeverity.Warning : monaco.MarkerSeverity.Error,
      startLineNumber: startPos.lineNumber,
      startColumn: startPos.column,
      endLineNumber: endPos.lineNumber,
      endColumn: endPos.column,
      message: `Oxc ${d.severity}: ${d.message}`,
    };
  });
});
</script>

<template>
  <MonacoEditor
    ref="monacoRef"
    v-model="editorValue"
    :language="language"
    :filename
    :markers
    :main
  />
</template>
