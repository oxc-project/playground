<script setup lang="ts">
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap-3>
    <div
      class="text-base text-[#3c3c43] font-semibold dark:text-[#fffff5]/[.86]"
    >
      Codegen
    </div>

    <div
      class="flex flex-col gap-3 border border-[#e2e2e3]/50 rounded-lg bg-[#f6f6f7]/50 p-3 dark:border-[#2e2e32]/50 dark:bg-[#161618]/50"
    >
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
