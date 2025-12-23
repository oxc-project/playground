<script setup lang="ts">
import { computed, ref } from 'vue'
import AstProperty from '~/components/ast/Property.vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const raw = ref(false)

const { oxc } = await useOxc()

const value = computed(() => {
  // Check if oxc.value.ir is already an object (like ast property)
  // or if it's a string that needs parsing
  const ir = oxc.value.ir
  
  if (typeof ir === 'object' && ir !== null) {
    // Already an object, use it directly
    return ir
  }
  
  // It's a string, try to parse as JSON
  try {
    return JSON.parse(ir)
  } catch (error) {
    // Not valid JSON, return empty object
    // Tree view won't work, but raw view will still show the string
    console.warn('Rust AST is not in JSON format, tree view unavailable')
    return {}
  }
})

const code = computed(() => {
  const ir = oxc.value.ir
  return typeof ir === 'string' ? ir : JSON.stringify(ir, null, 2)
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
