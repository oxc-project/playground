<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import { Input } from '../../ui/input'
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
    <label class="flex items-center gap-2">
      Target
      <Input v-model="options.transformer.target" class="p3!" />
    </label>
    <Checkbox
      id="id-enable"
      v-model="options.transformer.isolatedDeclarations"
      title="Isolated Declarations DTS Emit"
    />
  </div>
</template>
