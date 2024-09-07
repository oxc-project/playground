<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'
import { instance } from "@viz-js/viz";
import { Ref, ref, watch } from 'vue';
import { debounce } from 'lodash-es'

const { oxc } = await useOxc()

const panel: Ref<null | HTMLDivElement> = ref(null)

const debouncedHandler = debounce((value) => {
  instance().then((viz) => {
    let svg = viz.renderSVGElement(value);
    panel.value!.innerHTML = ''
    panel.value!.appendChild(svg)
  })
}, 100)

watch(() => oxc.value.cfgString, debouncedHandler)

</script>

<template>
  <div ref="panel"></div>
</template>
