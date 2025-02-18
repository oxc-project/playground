<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import Checkbox from '../ui/Checkbox.vue'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap2>
    <div font-medium>Prettier</div>
    <Checkbox v-model="options.run.prettierIr" label="Prettier IR" />
    <Checkbox v-model="options.run.prettierFormat" label="Prettier Format" />
  </div>
</template>
