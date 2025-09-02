<script setup lang="ts">
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import { Switch } from '~/ui/switch'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap2>
    <label flex items-center gap2>
      <Switch v-model:checked="options.run.compress" />
      <div font-small>Minify Syntax</div>
    </label>
  </div>

  <div flex flex-col gap2>
    <label flex items-center gap2>
      <Switch v-model:checked="options.run.whitespace" />
      <div font-small>Minify Whitespace</div>
    </label>
  </div>

  <div flex flex-col gap2>
    <label flex items-center gap2>
      <Switch v-model:checked="options.run.mangle" />
      <div font-small>Mangle Names</div>
    </label>

    <Checkbox
      v-model="options.mangle.topLevel"
      default-checked
      label="topLevel"
      font-mono
      label-class="text-xs"
    />

    <Checkbox
      v-model="options.mangle.keepNames"
      default-checked
      label="keepNames"
      font-mono
      label-class="text-xs"
    />
  </div>
</template>
