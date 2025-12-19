<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import { Input } from "~/ui/input";
import { Switch } from "~/ui/switch";

const { options } = await useOxc();
</script>

<template>
  <section class="flex flex-col gap-6" aria-labelledby="transformer-heading">
    <div class="flex flex-col gap-3">
      <label class="flex items-center gap-2">
        <Switch v-model:checked="options.run.transform" />
        <h2 id="transformer-heading" class="text-base font-medium">Transformer</h2>
      </label>

      <label class="flex items-center gap-2 text-sm">
        <span class="text-secondary-foreground">Target</span>
        <Input v-model="options.transformer.target" class="h-8 p-1" />
      </label>

      <div class="flex flex-col gap-2">
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

    <div class="flex flex-col gap-3">
      <label class="flex items-center gap-2">
        <Switch v-model:checked="options.run.isolatedDeclarations" />
        <h3 class="text-base font-medium">Isolated Declarations</h3>
      </label>

      <Checkbox
        v-model="options.isolatedDeclarations.stripInternal"
        default-checked
        label="stripInternal"
        font-mono
        label-class="text-xs"
      />
    </div>
  </section>
</template>
