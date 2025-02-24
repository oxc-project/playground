<script setup lang="ts">
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap2>
    <div font-medium>Codegen</div>
    <Checkbox
      v-model="options.codegen.enableSourcemap"
      label="Enable Source Map"
    />
  </div>
</template>
