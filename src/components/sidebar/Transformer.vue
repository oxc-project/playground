<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import Select from "~/components/ui/Select.vue";
import { useOxc } from "~/composables/oxc";
import { helperRuntime } from "~/composables/state";
import { Input } from "~/ui/input";
import SectionToggle from "./SectionToggle.vue";
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
    <SectionToggle
      v-model="options.run.transform"
      as="h2"
      heading-id="transformer-heading"
      label="Transformer"
    />

    <div v-show="options.run.transform" class="settings-children">
      <label class="settings-field">
        <span>Target</span>
        <Input v-model="options.transformer.target" class="settings-value w-24 font-mono" />
      </label>
      <label class="settings-field-stacked">
        <span>Runtime helpers</span>
        <Select v-model="helperRuntime" :options="helperRuntimeOptions" />
      </label>
      <p v-if="options.transformer.helperModuleName != null" class="settings-help break-all">
        Custom helper module: <code>{{ options.transformer.helperModuleName }}</code
        >. Edit as JSON to change or remove this override.
      </p>
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
    </div>

    <Define />

    <SectionToggle
      v-model="options.run.isolatedDeclarations"
      heading-id="declarations-heading"
      label="Isolated declarations"
    />
    <div v-if="options.run.isolatedDeclarations" class="settings-children">
      <Checkbox
        v-model="options.isolatedDeclarations.stripInternal"
        label="Strip internal declarations"
        title="stripInternal"
      />
    </div>
  </section>
</template>
