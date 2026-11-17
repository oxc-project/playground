<script lang="ts" setup>
import { useDark } from "@vueuse/core";
import * as monaco from "monaco-editor/editor/editor.api";
import { onBeforeUnmount, onMounted, ref, shallowRef, watch, watchEffect } from "vue";
import { editorCursor, outputHoverRange } from "~/composables/state";
import { getEditorTheme, registerEditorThemes } from "~/utils/editor-theme";

defineOptions({ name: "MonacoEditor" });

const props = defineProps<{
  modelValue: string;
  language: string;
  theme?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  readonly?: boolean;
  filename: string;
  modelUri?: monaco.Uri;
  markers?: monaco.editor.IMarkerData[];
  main?: boolean;
}>();
const emit = defineEmits(["editorWillMount", "editorDidMount", "change", "update:modelValue"]);

const container = ref<HTMLElement>();
const instance = shallowRef<monaco.editor.IStandaloneCodeEditor>();
const model = shallowRef<monaco.editor.ITextModel>(initModel());
let pendingSelection: [monaco.IPosition, monaco.IPosition] | undefined;

watchEffect((onCleanup) => {
  const dispose = model.value.onDidChangeContent(() => {
    const value = model.value.getValue();
    emit("update:modelValue", value);
  });
  onCleanup(() => dispose.dispose());
});

function initModel() {
  const model = monaco.editor.createModel(
    props.modelValue,
    props.language,
    props.modelUri ?? monaco.Uri.file(props.filename),
  );
  model.updateOptions({
    bracketColorizationOptions: { enabled: false, independentColorPoolPerBracketType: false },
  });
  return model;
}

const isDark = useDark({
  onChanged(isDark) {
    if (!instance.value) return;
    monaco.editor.setTheme(props.theme || getEditorTheme(isDark));
  },
});

watch(
  () => props.modelValue,
  (value) => {
    if (model.value.getValue() !== value) model.value.setValue(value);
  },
);

watch(
  () => props.language,
  () => {
    monaco.editor.setModelLanguage(model.value, props.language);
  },
);

watch(
  () => props.filename,
  () => {
    const previous = model.value;
    model.value = initModel();
    instance.value?.setModel(model.value);
    previous.dispose();
  },
);

watchEffect(() => {
  monaco.editor.setModelMarkers(model.value, "oxc", props.markers ?? []);
});

// Register effects during setup so Vue stops them even though editor creation
// waits for the lazy highlighter to load.
watchEffect((onCleanup) => {
  const editor = instance.value;
  const range = outputHoverRange.value;
  if (!props.main || !editor || !range) return;

  const highlight = Array.isArray(range)
    ? monaco.Range.fromPositions(
        model.value.getPositionAt(range[0]),
        model.value.getPositionAt(range[1]),
      )
    : monaco.Range.lift(range);
  const decorations = editor.createDecorationsCollection([
    {
      range: highlight,
      options: {
        isWholeLine: false,
        className: "ast-highlight",
      },
    },
  ]);
  onCleanup(() => decorations.clear());
});

function initMonaco() {
  const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: 13,
    lineHeight: 23,
    padding: { top: 16, bottom: 16 },
    lineNumbersMinChars: 3,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    fixedOverflowWidgets: true,
    fontFamily: `ui-monospace, Menlo, Monaco, "Cascadia Code", "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro","Fira Mono", "Droid Sans Mono", "Courier New", monospace`,
    ...props.options,
    model: model.value,
    theme: props.theme || getEditorTheme(isDark.value),
    automaticLayout: true,
    readOnly: props.readonly,
  };

  const editor = monaco.editor.create(container.value!, editorOptions);
  instance.value = editor;
  emit("editorDidMount", editor);

  if (props.main) {
    editor.onDidChangeCursorPosition((e) => {
      editorCursor.value = model.value.getOffsetAt(e.position);
    });
  }
}

onMounted(async () => {
  try {
    await registerEditorThemes();
  } catch (error) {
    console.warn("Failed to load editor highlighting; using the built-in theme:", error);
  }
  if (!model.value.isDisposed()) {
    initMonaco();
    if (pendingSelection) {
      revealRange(...pendingSelection);
      pendingSelection = undefined;
    }
  }
});

onBeforeUnmount(() => {
  instance.value?.dispose();
  instance.value = undefined;
  model.value.dispose();
});

const getPositionAt = (offset: number) => model.value.getPositionAt(offset);

function revealRange(start: monaco.IPosition, end: monaco.IPosition) {
  const editor = instance.value;
  if (!editor) {
    pendingSelection = [start, end];
    return;
  }
  const range = monaco.Range.fromPositions(start, end);
  editor.setSelection(range);
  editor.revealRangeInCenterIfOutsideViewport(range);
  editor.focus();
}

defineExpose({
  getPositionAt,
  revealRange,
});
</script>

<template>
  <div ref="container" class="h-full w-full" />
</template>
