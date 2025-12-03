<script setup lang="ts">
import { computed, ref } from 'vue'
import AstProperty from '~/components/ast/Property.vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import OutputPreview from './OutputPreview.vue'

const raw = ref(false)

const { oxc } = await useOxc()
const value = computed(() => {
  const comments = oxc.value.getComments()
  const errors = oxc.value.getDiagnostics()
  let program = {}
  try {
    // Here may throw errors, 'cause access `ast` will automatically invoke `JSON.parse()`.
    program = oxc.value.ast
  } catch (error) {
    console.error(error)
  }
  return { program, comments, errors }
})

const code = computed(() => {
  // Trim off first and last lines which contain `{"node":` and `,"fixes":[]}`
  let json = oxc.value.astJson
  json = json.slice(json.indexOf('\n') + 1)
  json = json.slice(0, json.lastIndexOf('\n'))
  return json
})
</script>

<template>
  <div h-full w-full overflow-auto p2>
    <Checkbox v-model="raw" label="Raw" />

    <OutputPreview v-if="raw" :code lang="json" />
    <div v-else pl4 pt2 text-sm leading-relaxed font-mono>
      <AstProperty :value root open />
    </div>
  </div>
</template>
