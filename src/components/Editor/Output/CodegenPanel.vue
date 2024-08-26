<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { highlight, highlighterPromise } from "src/utils/shiki";
import { computed } from "vue";

const { oxc } = await useOxc();
const highlighter = await highlighterPromise;

const codegenWithColor = computed(() => {
  if (!oxc.value?.codegenText) return "";
  return highlight(highlighter, oxc.value.codegenText, "tsx");
});
</script>

<template>
  <div
    class="flex-1 text-sm overflow-auto leading-relaxed"
    v-html="codegenWithColor"
  />
</template>
