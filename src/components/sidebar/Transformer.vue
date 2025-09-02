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
      <div font-small>Transformer</div>
    </label>

    <label flex items-center gap-2 text-sm>
      <span text-secondary-foreground>Target</span>
      <Input v-model="options.transformer.target" class="h-8 p-1" />
    </label>

    <Checkbox
      v-model="options.transformer.useDefineForClassFields"
      default-checked
      label="useDefineForClassFields"
      font-mono
      label-class="text-xs"
    />
  </div>

  <div flex flex-col gap2>
    <label flex items-center gap2>
      <Switch v-model:checked="options.run.isolatedDeclarations" />
      <div font-small>Isolated Declarations</div>
    </label>

    <Checkbox
      v-model="options.isolatedDeclarations.stripInternal"
      default-checked
      label="stripInternal"
      font-mono
      label-class="text-xs"
    />
  </div>
</template>
