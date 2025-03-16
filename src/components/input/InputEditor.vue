<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import * as monaco from 'monaco-editor'
import { computed } from 'vue'
import { useOxc } from '~/composables/oxc'
import { editorValue } from '~/composables/state'
import MonacoEditor from '../MonacoEditor.vue'

defineProps<{
  language: string
  filename: string
  main?: boolean
}>()

const { oxc } = await useOxc()

const monacoRef = templateRef<InstanceType<typeof MonacoEditor>>('monacoRef')
const getPositionAt = computed(() => monacoRef.value?.getPositionAt)

const markers = computed((): monaco.editor.IMarkerData[] => {
  if (!getPositionAt.value) return []

  const diagnostics = oxc.value.getDiagnostics2()
  return diagnostics.map((d) => {
    const startPos = getPositionAt.value(d.labels[0].start ?? 0)
    const endPos = getPositionAt.value(d.labels[0].end ?? 0)
    return {
      severity:
        d.severity === 'Warning'
          ? monaco.MarkerSeverity.Warning
          : monaco.MarkerSeverity.Error,
      startLineNumber: startPos.lineNumber,
      startColumn: startPos.column,
      endLineNumber: endPos.lineNumber,
      endColumn: endPos.column,
      message: `Oxc ${d.severity}: ${d.message}`,
    }
  })
})
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
