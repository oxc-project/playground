<script setup lang="ts">
import { instance } from '@viz-js/viz'
import { debouncedWatch } from '@vueuse/core'
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue'
import { useOxc } from 'src/composables/oxc'
import { ref, useTemplateRef } from 'vue'
import OutputPreview from './OutputPreview.vue'

const viz = await instance()

const { oxc } = await useOxc()
const panelEl = useTemplateRef<HTMLDivElement | null>('panel')

debouncedWatch(
  () => oxc.value.controlFlowGraph,
  (value) => {
    const svg = viz.renderSVGElement(value)
    panelEl.value!.innerHTML = ''
    panelEl.value!.append(svg)
  },
  { immediate: true, debounce: 100 },
)

const checked = ref(false)
</script>

<template>
  <div class="overflow-auto">
    <div class="flex flex-col gap-2.5">
      <label
        class="flex flex-row items-center gap-4 [&>.checkbox]:hover:bg-neutral-100"
      >
        <CheckboxRoot
          v-model:checked="checked"
          class="h-[25px] w-[25px] flex appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] shadow-black outline-none hover:bg-black focus-within:shadow-[0_0_0_2px_black]"
        >
          <CheckboxIndicator
            class="h-full w-full flex items-center justify-center rounded bg-white"
          >
            <Icon icon="radix-icons:check" class="text-grass11 h-3.5 w-3.5" />
          </CheckboxIndicator>
        </CheckboxRoot>
        <span class="select-none text-white">Raw</span>
      </label>
    </div>
    <!-- eslint-disable-next-line vue/no-unused-refs -->
    <!-- <div ref="panel" /> -->
    <OutputPreview :code="oxc.controlFlowGraph" lang="tsx" />
  </div>
</template>
