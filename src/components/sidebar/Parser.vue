<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import { Input } from "~/ui/input";
import OptionsDisclosure from "./OptionsDisclosure.vue";

const { options } = await useOxc();
</script>

<template>
  <section class="settings-section" aria-labelledby="parser-heading">
    <h2 id="parser-heading">Parser</h2>
    <label class="settings-field">
      <span>File extension</span>
      <Input v-model="options.parser.extension" class="settings-value w-24 font-mono" />
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
