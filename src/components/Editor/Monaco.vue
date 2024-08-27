<script lang="ts" setup>
import { useDark } from "@vueuse/core";
import * as monaco from "monaco-editor";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import "src/composables/useEditorWorker";

defineOptions({ name: "MonacoEditor" });

const props = defineProps<{
  modelValue: string;
  language: string;
  theme?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  readonly?: boolean;
}>();
const emit = defineEmits([
  "editorWillMount",
  "editorDidMount",
  "change",
  "update:modelValue",
]);

const container: any = ref(null);
let instance: monaco.editor.IStandaloneCodeEditor | null = null;

const isDark = useDark({
  onChanged(isDark) {
    if (!instance) return;
    monaco.editor.setTheme(isDark ? "vs-dark" : "vs");
  },
});

watch(
  () => props.language,
  () => {
    const model = instance?.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, props.language);
    }
  },
);

const initMonaco = () => {
  const editorProps: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: true,
    fontFamily: `ui-monospace, Menlo, Monaco, "Cascadia Code", "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro","Fira Mono", "Droid Sans Mono", "Courier New", monospace`,
    ...props.options,
    value: props.modelValue,
    language: props.language,
    theme: props.theme || (isDark.value ? "vs-dark" : "vs"),
    automaticLayout: true,
  };

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    allowComments: true,
    enableSchemaRequest: true,
    trailingCommas: "ignore",
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.Preserve,
  });

  instance = monaco.editor.create(container.value, editorProps);

  instance.onDidChangeModelContent(() => {
    const value = instance!.getValue();
    emit("update:modelValue", value);
  });
  emit("editorDidMount", instance);
};

onMounted(() => {
  initMonaco();
});

onBeforeUnmount(() => {
  instance?.dispose();
});
</script>

<template>
  <div ref="container" class="w-full h-full" />
</template>
