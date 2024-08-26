<script setup lang="ts">
import { syntaxOptionState } from "src/composables/state";
import Checkbox from "../ui/Checkbox.vue";
import Select from "../ui/Select.vue";

function checkedTSX(checked: boolean) {
  syntaxOptionState.value.tsx = checked;
  if (checked) {
    syntaxOptionState.value.dts = false;
  }
}

function checkedDTS(checked: boolean) {
  syntaxOptionState.value.dts = checked;
  if (checked) {
    syntaxOptionState.value.tsx = false;
  }
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
        v-model="syntaxOptionState.syntax"
        title="Check Syntax"
      />
    </div>

    <Select
      v-model="syntaxOptionState.sourceType"
      title="Source"
      :options="[
        { value: 'module', label: 'Module' },
        { value: 'script', label: 'Script' },
      ]"
    />
    <Select
      v-model="syntaxOptionState.language"
      title="Language"
      :options="[
        { value: 'typescript', label: 'TypeScript' },
        { value: 'javascript', label: 'JavaScript' },
      ]"
    />

    <Checkbox
      v-if="syntaxOptionState.language === 'javascript'"
      id="jsx"
      v-model="syntaxOptionState.jsx"
      title="JSX"
    />
    <Checkbox
      v-if="syntaxOptionState.language === 'typescript'"
      id="tsx"
      :model-value="syntaxOptionState.tsx"
      title="TSX"
      @update:model-value="checkedTSX"
    />
    <Checkbox
      v-if="syntaxOptionState.language === 'typescript'"
      id="d.ts"
      :model-value="syntaxOptionState.dts"
      title="D.TS"
      @update:model-value="checkedDTS"
    />
  </div>
</template>
