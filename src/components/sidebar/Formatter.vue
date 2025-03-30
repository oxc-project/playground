<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import Checkbox from '../ui/Checkbox.vue'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap2>
    <div font-medium>Formatter</div>
    <Checkbox v-model="options.run.formatterIr" label="Formatter IR" />
    <Checkbox v-model="options.run.formatterFormat" label="Formatter Format" />
  </div>
</template>
