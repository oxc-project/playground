<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { highlight, highlighterPromise } from "src/utils/shiki";
import { computed } from "vue";

const { oxc } = await useOxc();
const highlighter = await highlighterPromise;

const astWithColor = computed(() => {
  if (!oxc.value?.ast) return "";
  return highlight(
    highlighter,
    JSON.stringify(oxc.value.ast, undefined, 2),
    "json",
  );
});
</script>

<template>
  <div
    class="flex-1 text-sm overflow-auto leading-relaxed"
    v-html="astWithColor"
  />
</template>
