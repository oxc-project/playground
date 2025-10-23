<script setup lang="ts">
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import { Input } from '~/ui/input'
import { Switch } from '~/ui/switch'

const { options } = await useOxc()
</script>

<template>
  <div flex flex-col gap-3>
    <label class="group flex cursor-pointer items-center gap-3">
      <Switch v-model:checked="options.run.transform" />
      <div
        class="text-base text-[#3c3c43] font-semibold transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
      >
        Transformer
      </div>
    </label>

    <label class="flex items-center gap-2 text-sm">
      <span class="text-[#3c3c43]/[.78] font-medium dark:text-[#fffff5]/[.70]"
        >Target</span
      >
      <Input
        v-model="options.transformer.target"
        class="h-8 border-[#e2e2e3] rounded-lg p-2 text-xs transition-colors dark:border-[#2e2e32] focus:border-[#3451b2] dark:focus:border-[#a8b1ff]"
      />
    </label>

    <div
      class="flex flex-col gap-3 border border-[#e2e2e3]/50 rounded-lg bg-[#f6f6f7]/50 p-3 dark:border-[#2e2e32]/50 dark:bg-[#161618]/50"
    >
      <Checkbox
        v-model="options.transformer.useDefineForClassFields"
        default-checked
        label="useDefineForClassFields"
        font-mono
        label-class="text-xs"
      />

      <Checkbox
        v-model="options.transformer.experimentalDecorators"
        label="experimentalDecorators"
        font-mono
        label-class="text-xs"
      />

      <Checkbox
        v-model="options.transformer.emitDecoratorMetadata"
        label="emitDecoratorMetadata"
        font-mono
        label-class="text-xs"
      />
    </div>
  </div>

  <div class="mt-4 flex flex-col gap-3">
    <label class="group flex cursor-pointer items-center gap-3">
      <Switch v-model:checked="options.run.isolatedDeclarations" />
      <div
        class="text-base text-[#3c3c43] font-semibold transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
      >
        Isolated Declarations
      </div>
    </label>

    <div
      class="border border-[#e2e2e3]/50 rounded-lg bg-[#f6f6f7]/50 p-3 dark:border-[#2e2e32]/50 dark:bg-[#161618]/50"
    >
      <Checkbox
        v-model="options.isolatedDeclarations.stripInternal"
        default-checked
        label="stripInternal"
        font-mono
        label-class="text-xs"
      />
    </div>
  </div>
</template>
