<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import Checkbox from "../ui/Checkbox.vue";

const { options } = await useOxc();
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]">
      Lint Options
    </p>
    <Checkbox id="lint-enable" v-model="options.run.lint" title="Enable" />
  </div>
</template>
