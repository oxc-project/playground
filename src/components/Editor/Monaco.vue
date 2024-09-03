<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue'
import 'src/composables/editor.worker'

defineOptions({ name: 'MonacoEditor' })

const props = defineProps<{
  modelValue: string
  language: string
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  readonly?: boolean
  filename: string
  markers?: monaco.editor.IMarkerData[]
}>()
const emit = defineEmits([
  'editorWillMount',
  'editorDidMount',
  'change',
  'update:modelValue',
])

const container: any = ref(null)
let instance: monaco.editor.IStandaloneCodeEditor | undefined
const model = shallowRef<monaco.editor.ITextModel>(initModel())

watchEffect((onCleanup) => {
  const { dispose } = model.value.onDidChangeContent(() => {
    const value = model.value.getValue()
    emit('update:modelValue', value)
  })
  onCleanup(() => dispose())
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
    monaco.editor.setModelLanguage(model.value, props.language)
  },
)

watch(
  () => props.filename,
  () => {
    if (instance) {
      model.value.dispose()
      model.value = initModel()
      instance.setModel(model.value)
    }
  },
)

watch(
  () => props.markers,
  () => {
    if (!instance) return
    if (props.markers) {
      monaco.editor.setModelMarkers(model.value, 'oxc', props.markers)
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
  instance.setModel(model.value)

  emit('editorDidMount', instance)
}

onMounted(() => {
  initMonaco()
})

onBeforeUnmount(() => {
  model.value.dispose()
  instance?.dispose()
})

const getPositionAt = (offset: number) => model.value.getPositionAt(offset)
defineExpose({
  getPositionAt,
})
</script>

<template>
  <div ref="container" class="h-full w-full" />
</template>
