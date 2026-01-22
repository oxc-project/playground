<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useOxc } from "~/composables/oxc";
import OutputPreview from "./OutputPreview.vue";

const { oxc } = await useOxc();

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
  <div class="w-full flex flex-col overflow-auto">
    <OutputPreview :code="oxc.codegenText" lang="tsx" />
    <a
      v-if="sourcemapLink"
      class="m-2 flex items-center self-start text-sm opacity-80"
      :href="sourcemapLink"
      target="_blank"
      rel="noopener"
    >
      <span
        class="text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
      >Visualize source map</span>
      <Icon
        icon="ri:arrow-right-up-line"
        class="ml-1 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6]"
      />
    </a>
  </div>
</template>
