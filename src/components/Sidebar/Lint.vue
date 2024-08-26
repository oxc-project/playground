<script setup lang="ts">
import { syntaxOptionState } from "src/composables/state";
import Checkbox from "../ui/Checkbox.vue";
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]">
      Lint Options
    </p>
    <Checkbox
      id="lint-enable"
      v-model="syntaxOptionState.linted"
      title="Enable"
    />
  </div>
</template>
