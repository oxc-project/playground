<script setup lang="ts">
import * as monaco from "monaco-editor/editor/editor.api";
import { computed, ref, useTemplateRef, watchEffect } from "vue";
import { useOxc } from "~/composables/oxc";
import { editorValue } from "~/composables/state";
import { createDiagnosticPositionMapper } from "~/utils/diagnostic-offsets";
import MonacoEditor from "../MonacoEditor.vue";

defineProps<{
  language: string;
  filename: string;
  main?: boolean;
}>();

const { oxc } = await useOxc();

const monacoRef = useTemplateRef("monacoRef");
const toPosition = computed(() => createDiagnosticPositionMapper(editorValue.value));
// Resolve the lazy map only when a diagnostic label actually needs a position.
const getPositionAt = (byteOffset: number) => toPosition.value(byteOffset);
const markers = ref<monaco.editor.IMarkerData[]>([]);

watchEffect(() => {
  const diagnostics = oxc.value.getDiagnostics();
  markers.value = diagnostics.map((d) => {
    const startPos = getPositionAt(d.labels[0]?.start ?? 0);
    const endPos = getPositionAt(d.labels[0]?.end ?? 0);
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

defineExpose({
  getPositionAt,
  revealRange: (start: number, end: number) =>
    monacoRef.value?.revealRange(getPositionAt(start), getPositionAt(end)),
  revealPositionRange: (range: monaco.IRange) =>
    monacoRef.value?.revealRange(
      { lineNumber: range.startLineNumber, column: range.startColumn },
      { lineNumber: range.endLineNumber, column: range.endColumn },
    ),
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
