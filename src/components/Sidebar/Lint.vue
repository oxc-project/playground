<script setup lang="ts">
import { syntaxOptionState } from "src/composables/state";
import Checkbox from "../ui/Checkbox.vue";

function checkedLint(checked: boolean) {
  syntaxOptionState.value.linted = checked;
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]">
      Lint Options
    </p>
    <Checkbox
      id="lint-enable"
      title="Enable Lint"
      :checked="syntaxOptionState.linted"
      :on-change="checkedLint"
    />
  </div>
</template>
