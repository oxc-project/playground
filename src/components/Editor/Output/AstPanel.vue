<script setup lang="ts">
import AstProperty from '~/components/ast/Property.vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import { computed, ref } from 'vue'
import OutputPreview from './OutputPreview.vue'

const raw = ref(false)

const { oxc } = await useOxc()
const value = computed(() => {
  const comments = oxc.value.getComments()
  const errors = oxc.value.getDiagnostics()
  const program = oxc.value.ast
  return { program, comments, errors }
})

const code = computed(() => {
  return JSON.stringify(value.value, undefined, 2)
})
</script>

<template>
  <div w-full overflow-auto p2>
    <Checkbox id="raw" v-model="raw" title="Raw" />

    <OutputPreview v-if="raw" :code lang="json" />
    <div v-else pl4 pt2 text-sm leading-relaxed font-mono>
      <AstProperty :value root open />
    </div>
  </div>
</template>
