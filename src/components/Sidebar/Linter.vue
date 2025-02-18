<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import { Switch } from '~/ui/switch'

const { options } = await useOxc()
</script>

<template>
  <label flex items-center gap2>
    <Switch v-model:checked="options.run.lint" />
    <div font-medium>Linter</div>
  </label>
</template>
