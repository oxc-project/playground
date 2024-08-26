<script setup lang="ts">
import { syntaxOptionState } from "src/composables/state";
import { useOxc } from "src/composables/useOxc";
import { computed } from "vue";
import Code from "./Code.vue";
import Output from "./OutputPanel.vue";

const { error } = await useOxc();

const errorStr = computed(() => {
  return Array.isArray(error.value)
    ? error.value.map(stringifyError).join("\n")
    : stringifyError(error);
});

function stringifyError(error: unknown) {
  if (!error) return "";
  if (error instanceof Error) return error.stack;
  return String(error);
}
</script>

<template>
  <main class="flex flex-1 flex-col md:flex-row min-h-0">
    <Code :language="syntaxOptionState.language" />
    <div class="w-full h-px md:w-px md:h-full bg-[#e2e2e3] dark:bg-[#2e2e32]" />
    <div class="flex-1 min-w-0">
      <Output v-if="!error" />
      <pre
        v-else
        class="text-red-400 p-2 overflow-auto h-full text-sm"
        v-text="errorStr"
      />
    </div>
  </main>
</template>
