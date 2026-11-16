<script setup lang="ts">
import { useOxc } from "~/composables/oxc";
import { Checkbox as CheckboxControl } from "~/ui/checkbox";

const { options } = await useOxc();
</script>

<template>
  <section class="settings-section" aria-labelledby="minifier-heading">
    <div class="settings-toggle-row">
      <h2 id="minifier-heading"><label for="compress">Compress</label></h2>
      <CheckboxControl id="compress" v-model:checked="options.run.compress" />
    </div>
    <div class="settings-toggle-row">
      <h3><label for="minify-whitespace">Minify whitespace</label></h3>
      <CheckboxControl id="minify-whitespace" v-model:checked="options.run.whitespace" />
    </div>
  </section>
</template>
