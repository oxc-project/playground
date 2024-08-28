<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'
import Checkbox from '../ui/Checkbox.vue'

const { options } = await useOxc()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="text-muted-foreground font-medium">Transformer</div>
    <Checkbox
      id="transform-enable"
      v-model="options.run.transform"
      title="Enable"
    />
  </div>
</template>
