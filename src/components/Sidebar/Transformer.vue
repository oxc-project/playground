<script setup lang="ts">
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import { Input } from '~/ui/input'
import { Switch } from '~/ui/switch'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap2>
    <label flex items-center gap2>
      <Switch v-model:checked="options.run.transform" />
      <div font-medium>Transformer</div>
    </label>

    <label flex items-center gap-2 text-sm>
      <span text-secondary-foreground>Target</span>
      <Input v-model="options.transformer.target" class="h-8 p-1" />
    </label>

    <Checkbox
      v-model="options.transformer.isolatedDeclarations"
      label="Isolated Declarations"
    />
  </div>
</template>
