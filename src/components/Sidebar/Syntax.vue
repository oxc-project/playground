<script setup lang="ts">
import { syntaxOptionState } from "src/composables/state";
import Checkbox from "../ui/Checkbox.vue";
import Select from "../ui/Select.vue";

function changeSourceType(sourceType: string) {
  syntaxOptionState.value.sourceType = sourceType;
}

function changeLanguage(language: string) {
  syntaxOptionState.value.language = language;
}

function checkedSyntax(checked: boolean) {
  syntaxOptionState.value.syntax = checked;
}

function checkedJSX(checked: boolean) {
  syntaxOptionState.value.jsx = checked;
}

function checkedTSX(checked: boolean) {
  syntaxOptionState.value.tsx = checked;
}

function checkedDTS(checked: boolean) {
  syntaxOptionState.value.dts = checked;
}
</script>

<template>
  <div class="pt-4 flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]">
        Syntax Options
      </div>
      <Checkbox
        :checked="syntaxOptionState.syntax"
        :onChange="checkedSyntax"
        id="syntax"
        title="Check Syntax"
      />
    </div>

    <Select
      :initValue="syntaxOptionState.sourceType"
      title="Source"
      :onChange="changeSourceType"
      :options="[
        { value: 'module', label: 'Module' },
        { value: 'script', label: 'Script' },
      ]"
    />
    <Select
      :initValue="syntaxOptionState.language"
      title="Language"
      :onChange="changeLanguage"
      :options="[
        { value: 'typescript', label: 'TypeScript' },
        { value: 'javascript', label: 'JavaScript' },
      ]"
    />

    <Checkbox
      :checked="
        syntaxOptionState.language === 'javascript' && syntaxOptionState.jsx
      "
      :onChange="checkedJSX"
      :disabled="syntaxOptionState.language === 'typescript'"
      id="jsx"
      title="JSX"
    />
    <Checkbox
      :checked="
        syntaxOptionState.language === 'typescript' && syntaxOptionState.tsx
      "
      :onChange="checkedTSX"
      :disabled="syntaxOptionState.language === 'javascript'"
      id="Tsx"
      title="TSX"
    />
    <Checkbox
      :checked="
        syntaxOptionState.language === 'typescript' && syntaxOptionState.dts
      "
      :onChange="checkedDTS"
      :disabled="syntaxOptionState.language === 'javascript'"
      id="d.ts"
      title="D.TS"
    />
  </div>
</template>
