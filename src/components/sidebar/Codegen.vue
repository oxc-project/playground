<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";

const { options } = await useOxc();
</script>

<template>
  <section class="flex flex-col gap-3" aria-labelledby="codegen-heading">
    <h2 id="codegen-heading" class="text-base font-medium">
      Codegen
    </h2>

    <div class="flex flex-col gap-2" role="group" aria-label="Codegen options">
      <Checkbox v-model="options.codegen.normal" label="comment" label-class="text-xs font-mono" />

      <Checkbox
        v-model="options.codegen.jsdoc"
        label="jsdoc comment"
        label-class="text-xs font-mono"
      />

      <Checkbox
        v-model="options.codegen.annotation"
        label="annotation comment"
        label-class="text-xs font-mono"
      />

      <Checkbox
        v-model="options.codegen.legal"
        label="legal comment"
        label-class="text-xs font-mono"
      />
    </div>
  </section>
</template>
