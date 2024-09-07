<script setup lang="ts">
import { instance } from '@viz-js/viz'
import { debounce } from 'lodash-es'
import { useOxc } from 'src/composables/oxc'
import { ref, watch, type Ref } from 'vue'

const { oxc } = await useOxc()

const panel: Ref<null | HTMLDivElement> = ref(null)

const debouncedHandler = debounce((value) => {
  instance().then((viz) => {
    const svg = viz.renderSVGElement(value)
    panel.value!.innerHTML = ''
    panel.value!.append(svg)
  })
}, 100)

watch(() => oxc.value.controlFlowGraph, debouncedHandler, { immediate: true })
</script>

<template>
  <div ref="panel" />
</template>
