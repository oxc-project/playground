<script setup lang="ts">
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import { Switch } from '~/ui/switch'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap-4>
    <div flex flex-col gap-2>
      <label class="group flex cursor-pointer items-center gap-3">
        <Switch v-model:checked="options.run.compress" />
        <div
          class="text-base text-[#3c3c43] font-semibold transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
        >
          Minify Syntax
        </div>
      </label>
    </div>

    <div flex flex-col gap-2>
      <label class="group flex cursor-pointer items-center gap-3">
        <Switch v-model:checked="options.run.whitespace" />
        <div
          class="text-base text-[#3c3c43] font-semibold transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
        >
          Minify Whitespace
        </div>
      </label>
    </div>

    <div flex flex-col gap-3>
      <label class="group flex cursor-pointer items-center gap-3">
        <Switch v-model:checked="options.run.mangle" />
        <div
          class="text-base text-[#3c3c43] font-semibold transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
        >
          Mangle Names
        </div>
      </label>

      <div
        class="ml-2 flex flex-col gap-3 border border-[#e2e2e3]/50 rounded-lg bg-[#f6f6f7]/50 p-3 dark:border-[#2e2e32]/50 dark:bg-[#161618]/50"
      >
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
