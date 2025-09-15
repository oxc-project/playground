<script setup lang="ts">
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import { Switch } from '~/ui/switch'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap-4>
    <div flex flex-col gap-2>
      <label flex items-center gap-2>
        <Switch v-model:checked="options.run.compress" />
        <div font-small>Minify Syntax</div>
      </label>
    </div>

    <div flex flex-col gap-2>
      <label flex items-center gap-2>
        <Switch v-model:checked="options.run.whitespace" />
        <div font-small>Minify Whitespace</div>
      </label>
    </div>

    <div flex flex-col gap-3>
      <label flex items-center gap-2>
        <Switch v-model:checked="options.run.mangle" />
        <div font-small>Mangle Names</div>
      </label>

      <div ml-2 flex flex-col gap-2>
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
    </div>
  </div>
</template>
