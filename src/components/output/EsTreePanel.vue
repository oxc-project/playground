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
  const errors = oxc.value.getDiagnostics2()
  // TODO: move wrapper to oxc
  // const program = oxc.value.ast
  const program = JSON.parse(oxc.value.astJson, function (key, value) {
    if (
      value === null &&
      key === 'value' &&
      Object.hasOwn(this, 'type') &&
      this.type === 'Literal'
    ) {
      if (Object.hasOwn(this, 'bigint')) {
        return BigInt(this.bigint)
      }
      if (Object.hasOwn(this, 'regex')) {
        const { regex } = this
        try {
          return new RegExp(regex.pattern, regex.flags)
        } catch {}
      }
    }
    return value
  })
  return { program, comments, errors }
})

const code = computed(() => {
  return JSON.stringify(value.value, undefined, 2)
})
</script>

<template>
  <div w-full overflow-auto p2>
    <Checkbox v-model="raw" label="Raw" />

    <OutputPreview v-if="raw" :code lang="json" />
    <div v-else pl4 pt2 text-sm leading-relaxed font-mono>
      <AstProperty :value root open />
    </div>
  </div>
</template>
