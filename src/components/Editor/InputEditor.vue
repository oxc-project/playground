<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import * as monaco from 'monaco-editor'
import { useOxc } from '~/composables/oxc'
import { editorValue } from '~/composables/state'
import { computed } from 'vue'
import Monaco from './Monaco.vue'

defineProps<{
  language: string
  filename: string
  main?: boolean
}>()

const { oxc } = await useOxc()

const monacoRef = templateRef<InstanceType<typeof Monaco>>('monacoRef')
const getPositionAt = computed(() => monacoRef.value?.getPositionAt)

const markers = computed((): monaco.editor.IMarkerData[] => {
  if (!getPositionAt.value) return []

  const diagnostics = oxc.value.getDiagnostics()
  return diagnostics.map((d: any) => {
    const startPos = getPositionAt.value(d.start)
    const endPos = getPositionAt.value(d.end)
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
  <Monaco
    ref="monacoRef"
    v-model="editorValue"
    :language="language"
    :filename
    :markers
    :main
  />
</template>
