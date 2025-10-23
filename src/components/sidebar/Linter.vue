<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import { Switch } from '~/ui/switch'

const { options } = await useOxc()
</script>

<template>
  <label class="group flex cursor-pointer items-center gap-3">
    <Switch v-model:checked="options.run.lint" />
    <div
      class="text-base text-[#3c3c43] font-semibold transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
    >
      Linter
    </div>
  </label>
</template>
