<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import OptionsDisclosure from "./OptionsDisclosure.vue";

const { options } = await useOxc();
</script>

<template>
  <section class="settings-section" aria-labelledby="codegen-heading">
    <h2 id="codegen-heading">Codegen</h2>
    <OptionsDisclosure label="Preserve comments">
      <div class="flex flex-col gap-1" role="group" aria-label="Codegen options">
        <Checkbox v-model="options.codegen.normal" label="Standard comments" title="normal" />
        <Checkbox v-model="options.codegen.jsdoc" label="JSDoc comments" title="jsdoc" />
        <Checkbox v-model="options.codegen.annotation" label="Annotations" title="annotation" />
        <Checkbox v-model="options.codegen.legal" label="Legal comments" title="legal" />
      </div>
    </OptionsDisclosure>
  </section>
</template>
