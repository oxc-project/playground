<script setup lang="ts">
import { instance } from '@viz-js/viz'
import { debouncedWatch } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const viz = await instance()

const { oxc, options } = await useOxc()
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
  <div class="w-full flex flex-col">
    <div flex gap4 p2>
      <Checkbox v-model="raw" label="Raw" />
      <Checkbox v-model="options.controlFlow.verbose" label="Verbose" />
    </div>

    <div class="overflow-auto">
      <OutputPreview v-show="raw" :code="oxc.controlFlowGraph" lang="text" />
      <div v-show="!raw" ref="panel" />
    </div>
  </div>
</template>
