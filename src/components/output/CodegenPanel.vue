<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useOxc } from "~/composables/oxc";
import ExecutionPanel from "./ExecutionPanel.vue";
import OutputPreview from "./OutputPreview.vue";

const { oxc } = await useOxc();
const sourceType = computed(() => {
  try {
    const { node } = JSON.parse(oxc.value.astJson) as { node: { sourceType: string } };
    return node.sourceType;
  } catch {
    return "script";
  }
});

const sourcemapLink = computed(() => {
  let code = oxc.value.codegenText;
  let map = oxc.value.codegenSourcemapText;
  if (code && map) {
    // encoding url hash for
    // https://github.com/evanw/source-map-visualization/blob/f3e9dfec20e7bfd9625d03dd0d427affa74a9c43/code.js#L2004-L2023
    const utf16ToUTF8 = (x: string) => unescape(encodeURIComponent(x));
    code = utf16ToUTF8(code);
    map = utf16ToUTF8(map);
    const hash = btoa(`${code.length}\0${code}${map.length}\0${map}`);
    return `https://evanw.github.io/source-map-visualization/#${hash}`;
  }
  return "";
});
</script>

<template>
  <div class="h-full min-h-0 w-full flex flex-col">
    <div class="min-h-0 flex-1 overflow-auto">
      <OutputPreview :code="oxc.codegenText" lang="tsx" />
      <a
        v-if="sourcemapLink"
        class="m-2 flex items-center self-start text-sm opacity-80"
        :href="sourcemapLink"
        target="_blank"
        rel="noopener"
      >
        <span class="text-foreground/80 font-medium hover:text-primary">Visualize source map</span>
        <Icon icon="ri:arrow-right-up-line" class="ml-1 h-3 w-3 text-muted-foreground" />
      </a>
    </div>
    <ExecutionPanel
      :code="oxc.codegenText"
      :source-type="sourceType"
      :source-map="oxc.codegenSourcemapText"
    />
  </div>
</template>
