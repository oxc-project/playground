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
  <div class="w-full overflow-auto p-3">
    <div
      class="mb-3 inline-block rounded-lg from-blue-50/30 to-purple-50/30 bg-gradient-to-r p-2 dark:from-blue-950/10 dark:to-purple-950/10"
    >
      <Checkbox v-model="raw" label="Raw" />
    </div>

    <OutputPreview v-if="raw" :code lang="json" />
    <div v-else class="pl-4 pt-2 text-sm leading-relaxed font-mono">
      <AstProperty :value root open />
    </div>
  </div>
</template>
