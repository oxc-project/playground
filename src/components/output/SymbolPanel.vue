<script setup lang="ts">
import { computed, ref } from 'vue'
import SymbolItem from '~/components/symbol/SymbolItem.vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const raw = ref(false)

const { oxc } = await useOxc()
const value = computed(() => {
  try {
    const symbolsJsonStr = oxc.value.symbolsJson
    if (!symbolsJsonStr) return {}
    return JSON.parse(symbolsJsonStr)
  } catch (error) {
    console.error('Error parsing symbols JSON:', error)
    return {}
  }
})

const code = computed(() => {
  return oxc.value.symbolsJson
})
</script>

<template>
  <div h-full w-full overflow-auto p2>
    <Checkbox v-model="raw" label="Raw" />

    <OutputPreview v-if="raw" :code lang="json" />
    <div v-else pl4 pt2 text-sm leading-relaxed font-mono>
      <SymbolItem v-for="symbol in value" :key="symbol" :value="symbol" />
    </div>
  </div>
</template>
