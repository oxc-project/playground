<script setup lang="ts">
import MangleProperties from "~/components/sidebar/MangleProperties.vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import { Checkbox as CheckboxControl } from "~/ui/checkbox";

const { options } = await useOxc();
</script>

<template>
  <section class="settings-section" aria-labelledby="minifier-heading">
    <div class="settings-toggle-row">
      <h2 id="minifier-heading">Minify syntax</h2>
      <CheckboxControl v-model:checked="options.run.compress" aria-labelledby="minifier-heading" />
    </div>
    <div class="settings-toggle-row">
      <h3 id="whitespace-heading">Minify whitespace</h3>
      <CheckboxControl
        v-model:checked="options.run.whitespace"
        aria-labelledby="whitespace-heading"
      />
    </div>
    <div class="settings-toggle-row">
      <h3 id="mangle-heading">Mangle names</h3>
      <CheckboxControl v-model:checked="options.run.mangle" aria-labelledby="mangle-heading" />
    </div>
    <div v-if="options.run.mangle" class="settings-children">
      <Checkbox v-model="options.mangle.topLevel" label="Mangle top-level names" title="topLevel" />
      <Checkbox
        v-model="options.mangle.keepNames"
        label="Keep function & class names"
        title="keepNames"
      />
    </div>
    <MangleProperties />
  </section>
</template>
