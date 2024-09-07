<script setup lang="ts">
import { instance } from '@viz-js/viz'
import { debouncedWatch } from '@vueuse/core'
import { useOxc } from 'src/composables/oxc'
import { useTemplateRef } from 'vue'

const viz = await instance()

const { oxc } = await useOxc()
const panelEl = useTemplateRef('panel')

debouncedWatch(
  () => oxc.value.controlFlowGraph,
  (value) => {
    const svg = viz.renderSVGElement(value)
    panelEl.value!.innerHTML = ''
    panelEl.value!.append(svg)
  },
  { immediate: true, debounce: 100 },
)
</script>

<template>
  <div class="overflow-auto">
    <!-- eslint-disable-next-line vue/no-unused-refs -->
    <div ref="panel" />
  </div>
</template>
