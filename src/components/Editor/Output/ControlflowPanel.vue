<script setup lang="ts">
import { instance } from '@viz-js/viz'
import { debouncedWatch } from '@vueuse/core'
import Checkbox from 'src/components/ui/Checkbox.vue'
import { useOxc } from 'src/composables/oxc'
import { ref, useTemplateRef } from 'vue'
import OutputPreview from './OutputPreview.vue'

const viz = await instance()

const { oxc } = await useOxc()
const panelEl = useTemplateRef<HTMLDivElement>('panel')

debouncedWatch(
  [() => oxc.value.controlFlowGraph, panelEl],
  ([graph, panel]) => {
    if (!panel) return
    const svg = viz.renderSVGElement(graph)
    panel.replaceChildren(svg)
  },
  { immediate: true, debounce: 100 },
)

const raw = ref(false)
</script>

<template>
  <div class="w-full flex flex-col overflow-auto">
    <Checkbox id="raw" v-model="raw" title="Raw" class="p-2" />

    <OutputPreview v-show="raw" :code="oxc.controlFlowGraph" lang="tsx" />
    <!-- eslint-disable-next-line vue/no-unused-refs -->
    <div v-show="!raw" ref="panel" />
  </div>
</template>
