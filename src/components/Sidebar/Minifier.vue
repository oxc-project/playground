<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import Checkbox from '../ui/Checkbox.vue'

const { options } = await useOxc()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="text-muted-foreground font-medium">Minifier</div>
    <Checkbox
      id="compress-enable"
      v-model="options.minifier.compress"
      title="Minify Syntax"
    />
    <Checkbox
      id="whitespace-enable"
      v-model="options.minifier.whitespace"
      title="Minify Whitespace"
    />
    <Checkbox
      id="mangle-enable"
      v-model="options.minifier.mangle"
      title="Mangle Symbols"
    />
  </div>
</template>
