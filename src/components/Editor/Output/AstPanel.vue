<script setup lang="ts">
import { dark } from "src/composables/state";
import { useOxc } from "src/composables/useOxc";
import { highlighterPromise } from "src/utils/shiki";
import { computed } from "vue";

const { oxc } = useOxc();
const highlighter = await highlighterPromise;

const astWithColor = computed(() => {
  if (!oxc.ast) return "";
  return highlighter.codeToHtml(JSON.stringify(oxc.ast, undefined, 2), {
    lang: "json",
    theme: dark.value ? "vitesse-dark" : "vitesse-light",
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
