<script setup lang="ts">
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'

const { options } = await useOxc()
</script>

<template>
  <div flex="~ col" gap2>
    <div font-medium>Minifier</div>
    <Checkbox v-model="options.minifier.compress" label="Minify Syntax" />
    <Checkbox v-model="options.minifier.whitespace" label="Minify Whitespace" />
    <Checkbox v-model="options.minifier.mangle" label="Mangle Symbols" />
  </div>
</template>
