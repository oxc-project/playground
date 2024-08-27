<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { computed } from "vue";
import Checkbox from "../ui/Checkbox.vue";
import Select from "../ui/Select.vue";

const { options } = await useOxc();

function getFilename() {
  return options.value.parser.sourceFilename || "test.tsx";
}

function setFilename(language: string, jsx: boolean, dts: boolean) {
  let ext: string;
  if (dts) {
    ext = "d.ts";
  } else {
    ext = `${language === "typescript" ? "ts" : "js"}${jsx ? "x" : ""}`;
  }
  options.value.parser.sourceFilename = `test.${ext}`;
}

const language = computed({
  get: () => (/\.[cm]?tsx?/.test(getFilename()) ? "typescript" : "javascript"),
  set: (value) => setFilename(value, jsx.value, dts.value),
});

const jsx = computed({
  get: () => /\.[jt]sx/.test(getFilename()),
  set: (value) => setFilename(language.value, value, dts.value),
});

const dts = computed({
  get: () => getFilename().endsWith(".d.ts"),
  set: (value) => setFilename(language.value, jsx.value, value),
});

function toggleJsx(checked: boolean) {
  if (checked && language.value === "typescript") {
    dts.value = false;
  }
  jsx.value = checked;
}

function toggleDts(checked: boolean) {
  dts.value = checked;
  if (checked) {
    jsx.value = false;
  }
}
</script>

<template>
  <div class="pt-4 flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]">
        Syntax Options
      </div>
      <Checkbox id="syntax" v-model="options.run.syntax" title="Check Syntax" />
    </div>

    <Select
      v-model="options.parser.sourceType"
      title="Source"
      default-value="module"
      :options="[
        { value: 'module', label: 'Module' },
        { value: 'script', label: 'Script' },
      ]"
    />

    <Select
      v-model="language"
      title="Language"
      :options="[
        { value: 'typescript', label: 'TypeScript' },
        { value: 'javascript', label: 'JavaScript' },
      ]"
    />

    <Checkbox
      id="jsx"
      :title="language === 'javascript' ? 'JSX' : 'TSX'"
      :model-value="jsx"
      @update:model-value="toggleJsx"
    />

    <Checkbox
      v-if="language === 'typescript'"
      id="d.ts"
      :model-value="dts"
      title="D.TS"
      @update:model-value="toggleDts"
    />

    <Checkbox
      id="preserveParens"
      v-model="options.parser.preserveParens"
      :default-checked="true"
      title="preserveParens"
    />
  </div>
</template>
