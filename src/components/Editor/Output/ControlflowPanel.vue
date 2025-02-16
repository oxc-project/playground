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
    <div class="flex">
      <Checkbox id="raw" v-model="raw" title="Raw" class="p-2" />
      <Checkbox
        id="verbose"
        v-model="options.controlFlow.verbose"
        title="Verbose"
        class="p-2"
      />
    </div>

    <div class="overflow-auto">
      <OutputPreview v-show="raw" :code="oxc.controlFlowGraph" lang="text" />
      <!-- eslint-disable-next-line vue/no-unused-refs -->
      <div v-show="!raw" ref="panel" />
    </div>
  </div>
</template>
