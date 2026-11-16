<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import Select from "~/components/ui/Select.vue";
import type { OxcParserOptions } from "oxc-playground";
import { useOxc } from "~/composables/oxc";
import OptionsDisclosure from "./OptionsDisclosure.vue";

const { options } = await useOxc();
const extensionOptions = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "mjs",
  "cjs",
  "mts",
  "cts",
  "d.ts",
  "d.mts",
  "d.cts",
].map((extension) => ({ value: extension, label: `.${extension}` }));
type SourceTypeSelection = NonNullable<OxcParserOptions["sourceType"]>;
const sourceTypeOptions: { value: SourceTypeSelection; label: string }[] = [
  { value: "module", label: "Module" },
  { value: "script", label: "Script" },
  { value: "commonjs", label: "CommonJS" },
  { value: "unambiguous", label: "Unambiguous" },
];
</script>

<template>
  <section class="settings-section" aria-labelledby="parser-heading">
    <h2 id="parser-heading">Parser</h2>
    <label class="settings-field-stacked">
      <span>File extension</span>
      <Select v-model="options.parser.extension" :options="extensionOptions" />
    </label>
    <label class="settings-field-stacked">
      <span>Source type</span>
      <Select v-model="options.parser.sourceType" :options="sourceTypeOptions" />
    </label>
    <OptionsDisclosure label="Parser settings">
      <Checkbox
        v-model="options.parser.semanticErrors"
        label="Semantic checks"
        title="semanticErrors"
      />
      <Checkbox
        v-model="options.parser.preserveParens"
        label="Preserve parentheses"
        title="preserveParens"
      />
      <Checkbox
        v-model="options.parser.allowReturnOutsideFunction"
        label="Allow top-level return"
        title="allowReturnOutsideFunction"
      />
      <Checkbox
        v-model="options.parser.allowV8Intrinsics"
        label="V8 intrinsics"
        title="allowV8Intrinsics"
      />
    </OptionsDisclosure>
  </section>
</template>
