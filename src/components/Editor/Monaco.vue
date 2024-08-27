<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import * as monaco from 'monaco-editor'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import 'src/composables/editor.worker'

defineOptions({ name: 'MonacoEditor' })

const props = defineProps<{
  modelValue: string
  language: string
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  readonly?: boolean
  filename: string
}>()
const emit = defineEmits([
  'editorWillMount',
  'editorDidMount',
  'change',
  'update:modelValue',
])

const container: any = ref(null)
let instance: monaco.editor.IStandaloneCodeEditor | undefined
let model: monaco.editor.ITextModel = initModel()

model.onDidChangeContent(() => {
  const value = model.getValue()
  emit('update:modelValue', value)
})

function initModel() {
  return monaco.editor.createModel(
    props.modelValue,
    props.language,
    monaco.Uri.file(props.filename),
  )
}

const isDark = useDark({
  onChanged(isDark) {
    if (!instance) return
    monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs')
  },
})

watch(
  () => props.language,
  () => {
    if (model) {
      monaco.editor.setModelLanguage(model, props.language)
    }
  },
)

watch(
  () => props.filename,
  () => {
    if (instance) {
      model.dispose()
      model = initModel()
      instance.setModel(model)
    }
  },
)

function initMonaco() {
  const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: true,
    fontFamily: `ui-monospace, Menlo, Monaco, "Cascadia Code", "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro","Fira Mono", "Droid Sans Mono", "Courier New", monospace`,
    ...props.options,
    theme: props.theme || (isDark.value ? 'vs-dark' : 'vs'),
    automaticLayout: true,
    readOnly: props.readonly,
  }

  instance = monaco.editor.create(container.value, editorOptions)
  instance.setModel(model)

  emit('editorDidMount', instance)
}

onMounted(() => {
  initMonaco()
})

onBeforeUnmount(() => {
  model.dispose()
  instance?.dispose()
})
</script>

<template>
  <div ref="container" class="w-full h-full" />
</template>
