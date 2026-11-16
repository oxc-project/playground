<script setup lang="ts">
import MangleProperties from "~/components/sidebar/MangleProperties.vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import SectionToggle from "./SectionToggle.vue";

const { options } = await useOxc();
</script>

<template>
  <section class="settings-section" aria-labelledby="mangler-heading">
    <SectionToggle
      v-model="options.run.mangle"
      as="h2"
      heading-id="mangler-heading"
      label="Mangle identifiers"
    />
    <div v-show="options.run.mangle" class="settings-children">
      <Checkbox v-model="options.mangle.topLevel" label="Mangle top-level names" title="topLevel" />
      <Checkbox
        v-model="options.mangle.keepNames"
        label="Keep function & class names"
        title="Keep names during identifier mangling"
      />
      <p
        v-if="options.run.compress && options.mangle.keepNames && !options.compress.keepNames"
        class="settings-help"
      >
        Compression can still change function and class names.
      </p>
    </div>
    <MangleProperties />
  </section>
</template>
