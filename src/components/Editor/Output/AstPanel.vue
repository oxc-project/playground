<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'
import { computed } from 'vue'
// import OutputPreview from './OutputPreview.vue'
import AstProperty from 'src/components/ast/Property.vue'

const { oxc } = await useOxc()
const value = computed(() => {
  const comments = oxc.value.getComments()
  const errors = oxc.value.getDiagnostics()
  const program = oxc.value.ast
  return { program, comments, errors }
})

// const code = computed(() => {
//   return JSON.stringify(value.value, undefined, 2)
// })
</script>

<template>
  <div w-full overflow-auto pl4 text-sm leading-relaxed font-mono>
    <AstProperty :value root open />
  </div>
  <!-- TODO switcher -->
  <!-- <OutputPreview :code lang="json" /> -->
</template>
