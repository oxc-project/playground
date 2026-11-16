<script setup lang="ts">
import MangleProperties from "~/components/sidebar/MangleProperties.vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import { Checkbox as CheckboxControl } from "~/ui/checkbox";

const { options } = await useOxc();
</script>

<template>
  <section class="settings-section" aria-labelledby="mangler-heading">
    <div class="settings-toggle-row">
      <h2 id="mangler-heading"><label for="mangle-identifiers">Mangle identifiers</label></h2>
      <CheckboxControl id="mangle-identifiers" v-model:checked="options.run.mangle" />
    </div>
    <div v-show="options.run.mangle" class="settings-children">
      <Checkbox v-model="options.mangle.topLevel" label="Mangle top-level names" title="topLevel" />
      <Checkbox
        v-model="options.mangle.keepNames"
        label="Keep function & class names"
        title="Keep names during identifier mangling"
      />
      <p v-if="options.run.compress && options.mangle.keepNames" class="settings-help">
        Compression can still change function and class names.
      </p>
    </div>
    <MangleProperties />
  </section>
</template>
