<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import Checkbox from '../ui/Checkbox.vue'

const { options } = await useOxc()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="text-muted-foreground font-medium">Prettier</div>
    <Checkbox
      id="prettier-ir"
      v-model="options.run.prettierIr"
      title="Prettier IR"
    />
    <Checkbox
      id="prettier-format"
      v-model="options.run.prettierFormat"
      title="Prettier Format"
    />
  </div>
</template>
