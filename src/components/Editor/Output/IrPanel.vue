<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { highlight, highlighterPromise } from "src/utils/shiki";
import { computed } from "vue";

const { oxc } = await useOxc();
const highlighter = await highlighterPromise;

const codegenWithColor = computed(() => {
  if (!oxc.value?.ir) return "";
  return highlight(highlighter, oxc.value.ir as any as string, "tsx");
});
</script>

<template>
  <div class="flex-1 text-sm overflow-auto" v-html="codegenWithColor" />
</template>
