<script setup lang="ts">
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
  <div class="pt-4 flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]">
        Syntax Options
      </div>
      <Checkbox
        :checked="syntaxState.syntax"
        :onChange="checkedSyntax"
        id="syntax"
        title="Check Syntax"
      />
    </div>

    <Select
      :initValue="syntaxState.sourceType"
      title="Source"
      :onChange="changeSourceType"
      :options="[
        { value: 'module', label: 'Module' },
        { value: 'script', label: 'Script' },
      ]"
    />
    <Select
      :initValue="syntaxState.language"
      title="Language"
      :onChange="changeLanguage"
      :options="[
        { value: 'typescript', label: 'TypeScript' },
        { value: 'javascript', label: 'JavaScript' },
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
