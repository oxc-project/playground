<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import { Switch } from "~/ui/switch";

const { options } = await useOxc();
</script>

<template>
  <section class="flex flex-col gap-4" aria-labelledby="minifier-heading">
    <div class="flex flex-col gap-2">
      <label class="flex items-center gap-2">
        <Switch v-model:checked="options.run.compress" />
        <h2 id="minifier-heading" class="text-base font-medium">
          Minify Syntax
        </h2>
      </label>
    </div>

    <div class="flex flex-col gap-2">
      <label class="flex items-center gap-2">
        <Switch v-model:checked="options.run.whitespace" />
        <h3 class="text-base font-medium">Minify Whitespace</h3>
      </label>
    </div>

    <div class="flex flex-col gap-3">
      <label class="flex items-center gap-2">
        <Switch v-model:checked="options.run.mangle" />
        <h3 class="text-base font-medium">Mangle Names</h3>
      </label>

      <div class="ml-2 flex flex-col gap-2">
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
  </section>
</template>
