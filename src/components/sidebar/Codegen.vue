<script setup lang="ts">
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap-3>
    <div font-medium>Codegen</div>

    <div flex flex-col gap-2>
      <Checkbox
        v-model="options.codegen.normal"
        label="comment"
        font-mono
        label-class="text-xs"
      />

      <Checkbox
        v-model="options.codegen.jsdoc"
        label="jsdoc comment"
        font-mono
        label-class="text-xs"
      />

      <Checkbox
        v-model="options.codegen.annotation"
        label="annotation comment"
        font-mono
        label-class="text-xs"
      />

      <Checkbox
        v-model="options.codegen.legal"
        label="legal comment"
        font-mono
        label-class="text-xs"
      />
    </div>
  </div>
</template>
