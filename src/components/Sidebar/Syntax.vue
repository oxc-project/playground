<script setup lang="ts">
import { capitalize } from "vue";
import Checkbox from "../ui/Checkbox.vue";
import Select from "../ui/Select.vue";

const props = defineProps(["syntaxState"]);
const emit = defineEmits(["update:syntaxState"]);

function changeSourceType(sourceType: string) {
  props.syntaxState.sourceType = sourceType;
}

function changeLanguage(language: string) {
  props.syntaxState.language = language;
}

function checkedSyntax(checked: boolean) {
  props.syntaxState.syntax = checked;
}

function checkedJSX(checked: boolean) {
  props.syntaxState.jsx = checked;
}

function checkedTSX(checked: boolean) {
  props.syntaxState.tsx = checked;
}

function checkedDTS(checked: boolean) {
  props.syntaxState.dts = checked;
}
</script>

<template>
  <div>
    <p
      class="pt-4 text-xl font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]"
    >
      Syntax Options
    </p>

    <Checkbox
      :checked="syntaxState.syntax"
      :onChange="checkedSyntax"
      id="syntax"
      title="Check Syntax"
    />

    <Select
      :initValue="syntaxState.sourceType"
      :title="capitalize('source')"
      :onChange="changeSourceType"
      :options="[
        { value: 'module', label: 'module' },
        { value: 'script', label: 'script' },
      ]"
    />
    <Select
      :initValue="syntaxState.language"
      :title="capitalize('language')"
      :onChange="changeLanguage"
      :options="[
        { value: 'typescript', label: 'typescript' },
        { value: 'javascript', label: 'javascript' },
      ]"
    />

    <Checkbox
      :checked="syntaxState.language === 'javascript' && syntaxState.jsx"
      :onChange="checkedJSX"
      :disabled="syntaxState.language === 'typescript'"
      id="jsx"
      title="JSX"
    />
    <Checkbox
      :checked="syntaxState.language === 'typescript' && syntaxState.tsx"
      :onChange="checkedTSX"
      :disabled="syntaxState.language === 'javascript'"
      id="Tsx"
      title="TSX"
    />
    <Checkbox
      :checked="syntaxState.language === 'typescript' && syntaxState.dts"
      :onChange="checkedDTS"
      :disabled="syntaxState.language === 'javascript'"
      id="d.ts"
      title="D.TS"
    />
  </div>
</template>
