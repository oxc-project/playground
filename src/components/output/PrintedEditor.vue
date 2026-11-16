<script setup lang="ts">
import * as monaco from "monaco-editor/editor/editor.api";
import { computed, inject, onBeforeUnmount, ref, shallowRef, useId, watch } from "vue";
import { sourceNavigationKey } from "~/composables/source-navigation";
import { createPrintedSourceMapper } from "~/utils/printed-source-map";
import { registerPrintedDefinitions } from "~/utils/printed-definitions";
import MonacoEditor from "../MonacoEditor.vue";

const props = defineProps<{
  extension: string;
  code: string;
  sourceMap: string;
  source: string;
}>();

const navigateToSource = inject(sourceNavigationKey);
const filename = `/printed-${useId()}.${props.extension}`;
const modelUri = monaco.Uri.from({ scheme: "printed", path: filename });
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>();
const toOriginal = computed(() => createPrintedSourceMapper(props.sourceMap, props.source));
const disposables: monaco.IDisposable[] = [];
const navigationMessage = ref("");

function originalRange() {
  const position = editor.value?.getPosition();
  const model = editor.value?.getModel();
  if (!position || !model || model.getValue() !== props.code) return;
  const word = model.getWordAtPosition(position);
  // Use the token start even when the cursor is in the middle of its name.
  return toOriginal.value({
    lineNumber: position.lineNumber,
    column: word?.startColumn ?? position.column,
  });
}

function clearNavigationMessage() {
  navigationMessage.value = "";
}

function mount(instance: monaco.editor.IStandaloneCodeEditor) {
  editor.value = instance;
  disposables.push(
    registerPrintedDefinitions(instance.getModel()!),
    instance.addAction({
      id: "printed.goToOriginalSource",
      label: "Go to Original Source",
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.6,
      run() {
        const range = originalRange();
        if (!range || !navigateToSource) {
          navigationMessage.value = "No original source mapping at this position.";
          return;
        }
        clearNavigationMessage();
        navigateToSource(range);
      },
    }),
    instance.onDidChangeCursorPosition(clearNavigationMessage),
    instance.onDidChangeModelContent(clearNavigationMessage),
  );
  clearNavigationMessage();
}

watch(toOriginal, clearNavigationMessage, { flush: "post" });
onBeforeUnmount(() => {
  for (const disposable of disposables) disposable.dispose();
});
</script>

<template>
  <div class="printed-editor h-full min-h-0 flex flex-col">
    <MonacoEditor
      class="min-h-0 flex-1"
      :model-value="code"
      language="printed-typescript"
      :filename
      :model-uri
      readonly
      :options="{
        ariaLabel:
          'Printed output. F12 goes to a generated definition. Right-click for Go to Original Source; unavailable for unmapped text.',
        domReadOnly: true,
        readOnlyMessage: {
          value: 'Printed output is read-only. Edit the source input to update it.',
        },
        renderValidationDecorations: 'off',
        folding: false,
        glyphMargin: false,
        overviewRulerLanes: 0,
        lineNumbersMinChars: 3,
      }"
      @editor-did-mount="mount"
    />
    <p
      v-if="navigationMessage"
      class="shrink-0 border-t px-3 py-1 text-xs text-muted-foreground"
      role="status"
    >
      {{ navigationMessage }}
    </p>
  </div>
</template>
