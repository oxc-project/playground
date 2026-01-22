<script setup lang="ts">
import { useOxc } from "~/composables/oxc";
import { Switch } from "~/ui/switch";

const { options } = await useOxc();
</script>

<template>
  <section aria-labelledby="linter-heading">
    <label class="flex items-center gap-2">
      <Switch v-model:checked="options.run.lint" />
      <h2 id="linter-heading" class="text-base font-medium">Linter</h2>
    </label>
  </section>
</template>
