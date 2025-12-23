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
    // Try to parse the IR as JSON
    return JSON.parse(oxc.value.ir)
  } catch (error) {
    // If it's not JSON, return an empty object
    // The raw view will still show the original text
    console.error(error)
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
