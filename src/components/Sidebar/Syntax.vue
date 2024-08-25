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
        id="syntax"
        :checked="syntaxOptionState.syntax"
        :on-change="checkedSyntax"
        title="Check Syntax"
      />
    </div>

    <Select
      :init-value="syntaxOptionState.sourceType"
      title="Source"
      :on-change="changeSourceType"
      :options="[
        { value: 'module', label: 'Module' },
        { value: 'script', label: 'Script' },
      ]"
    />
    <Select
      :init-value="syntaxOptionState.language"
      title="Language"
      :on-change="changeLanguage"
      :options="[
        { value: 'typescript', label: 'TypeScript' },
        { value: 'javascript', label: 'JavaScript' },
      ]"
    />

    <Checkbox
      v-if="syntaxOptionState.language === 'javascript'"
      id="jsx"
      :checked="syntaxOptionState.jsx"
      :on-change="checkedJSX"
      title="JSX"
    />
    <Checkbox
      v-if="syntaxOptionState.language === 'typescript'"
      id="Tsx"
      :checked="syntaxOptionState.tsx"
      :on-change="checkedTSX"
      title="TSX"
    />
    <Checkbox
      id="d.ts"
      :checked="
        syntaxOptionState.language === 'typescript' && syntaxOptionState.dts
      "
      :on-change="checkedDTS"
      :disabled="syntaxOptionState.language === 'javascript'"
      title="D.TS"
    />
  </div>
</template>
