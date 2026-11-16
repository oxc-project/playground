<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import Select from "~/components/ui/Select.vue";
import { useOxc } from "~/composables/oxc";
import { helperRuntime } from "~/composables/state";
import { Input } from "~/ui/input";
import { Checkbox as CheckboxControl } from "~/ui/checkbox";
import Define from "./Define.vue";
import OptionsDisclosure from "./OptionsDisclosure.vue";

const { options } = await useOxc();

const helperRuntimeOptions: { value: "npm" | "esm"; label: string }[] = [
  { value: "npm", label: "@oxc-project/runtime" },
  { value: "esm", label: "esm.sh (versioned URL)" },
];
</script>

<template>
  <section class="settings-section" aria-labelledby="transformer-heading">
    <div class="settings-toggle-row">
      <h2 id="transformer-heading">Transformer</h2>
      <CheckboxControl
        v-model:checked="options.run.transform"
        aria-labelledby="transformer-heading"
      />
    </div>

    <div v-show="options.run.transform" class="settings-children">
      <label class="settings-field">
        <span>Target</span>
        <Input v-model="options.transformer.target" class="settings-value w-24 font-mono" />
      </label>
      <label class="settings-field-stacked">
        <span>Runtime helpers</span>
        <Select v-model="helperRuntime" :options="helperRuntimeOptions" />
      </label>
      <OptionsDisclosure label="Transform options">
        <Checkbox
          v-model="options.transformer.useDefineForClassFields"
          label="Define class fields"
          title="useDefineForClassFields"
        />
        <Checkbox
          v-model="options.transformer.experimentalDecorators"
          label="Legacy decorators"
          title="experimentalDecorators"
        />
        <Checkbox
          v-model="options.transformer.emitDecoratorMetadata"
          label="Decorator metadata"
          title="emitDecoratorMetadata"
        />
        <Checkbox
          v-model="options.transformer.optimizeEnums"
          label="Optimize enums"
          title="optimizeEnums"
        />
        <Checkbox
          v-model="options.transformer.optimizeConstEnums"
          label="Optimize const enums"
          title="optimizeConstEnums"
        />
      </OptionsDisclosure>
      <Define />
    </div>

    <div class="settings-toggle-row">
      <h3 id="declarations-heading">Isolated declarations</h3>
      <CheckboxControl
        v-model:checked="options.run.isolatedDeclarations"
        aria-labelledby="declarations-heading"
      />
    </div>
    <div v-if="options.run.isolatedDeclarations" class="settings-children">
      <Checkbox
        v-model="options.isolatedDeclarations.stripInternal"
        label="Strip internal declarations"
        title="stripInternal"
      />
    </div>
  </section>
</template>
