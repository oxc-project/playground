<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { highlight, highlighterPromise } from "src/utils/shiki";
import { computed } from "vue";

const { oxc } = useOxc();
const highlighter = await highlighterPromise;

const codeWithColor = computed(() => {
  if (!oxc.value?.prettierFormattedText) return "";
  return highlight(highlighter, oxc.value.prettierFormattedText, "tsx");
});
</script>

<template>
  <div class="flex-1 text-sm overflow-auto" v-html="codeWithColor" />
</template>
