<script setup lang="ts">
import { computed, ref } from 'vue'
import AstProperty from '~/components/ast/Property.vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const raw = ref(false)

const { oxc } = await useOxc()

const value = computed(() => {
  try {
    // Parse the Rust AST IR as JSON for tree view
    return JSON.parse(oxc.value.ir)
  } catch (error) {
    console.error('Failed to parse Rust AST:', error)
    return {}
  }
})

const code = computed(() => {
  return oxc.value.ir
})
</script>

<template>
  <div h-full w-full overflow-auto p2>
    <Checkbox v-model="raw" label="Raw" />

    <OutputPreview v-if="raw" :code lang="tsx" />
    <div v-else pl4 pt2 text-sm leading-relaxed font-mono>
      <AstProperty :value root open />
    </div>
  </div>
</template>
