<script setup lang="ts">
import { computed } from "vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import Select from "~/components/ui/Select.vue";
import { useOxc } from "~/composables/oxc";
import { Checkbox as CheckboxControl } from "~/ui/checkbox";
import OptionsDisclosure from "./OptionsDisclosure.vue";

const { options } = await useOxc();
const unusedOptions = [
  { value: "remove", label: "Remove" },
  { value: "keep_assign", label: "Keep assigned" },
  { value: "keep", label: "Keep all" },
];
const unused = computed({
  get: () => {
    const value = options.value.compress.unused;
    return value === false ? "keep" : value === "keep_assign" ? "keep_assign" : "remove";
  },
  set: (value: string) => {
    options.value.compress.unused = value === "keep_assign" ? value : value === "remove";
  },
});
</script>

<template>
  <section class="settings-section" aria-labelledby="minifier-heading">
    <div class="settings-toggle-row">
      <h2 id="minifier-heading"><label for="compress">Compress</label></h2>
      <CheckboxControl id="compress" v-model:checked="options.run.compress" />
    </div>
    <OptionsDisclosure v-show="options.run.compress" label="Compression options">
      <Checkbox v-model="options.compress.dropDebugger" label="Remove debugger statements" />
      <Checkbox v-model="options.compress.dropConsole" label="Remove console calls" />
      <p v-if="options.compress.dropConsole" class="settings-help">
        Also removes evaluation of console arguments.
      </p>
      <Checkbox v-model="options.compress.joinVars" label="Join variable declarations" />
      <Checkbox v-model="options.compress.sequences" label="Combine statements" />
      <Checkbox v-model="options.compress.keepNames" label="Keep function & class names" />
      <label class="settings-field-stacked">
        <span>Unused bindings</span>
        <Select v-model="unused" :options="unusedOptions" />
      </label>
    </OptionsDisclosure>
    <div class="settings-toggle-row">
      <h3><label for="minify-whitespace">Minify whitespace</label></h3>
      <CheckboxControl id="minify-whitespace" v-model:checked="options.run.whitespace" />
    </div>
  </section>
</template>
