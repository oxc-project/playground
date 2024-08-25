<script setup lang="ts">
import { useOxc } from "src/composable/useOxc";
import { highlighter } from "src/utils/shiki";
import { computed } from "vue";

const { oxc } = useOxc();

const astWithColor = computed(() => {
  if (!oxc.ast) return "";
  return highlighter.codeToHtml(JSON.stringify(oxc.ast, undefined, 2), {
    lang: "json",
    theme: "vitesse-dark",
    transformers: [
      {
        name: "add-style",
        pre(node) {
          this.addClassToHast(node, "!bg-transparent p-2");
        },
      },
    ],
  });
});
</script>

<template>
  <div class="overflow-scroll h-screen" v-html="astWithColor" />
</template>
