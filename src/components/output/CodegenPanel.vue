<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computedAsync } from "@vueuse/core";
import { computed, ref } from "vue";
import { useOxc } from "~/composables/oxc";
import ExecutionPanel from "./ExecutionPanel.vue";
import OutputPreview from "./OutputPreview.vue";

const { oxc, baselineCode, baselineSourcemap, baselineError } = await useOxc();
const sourceType = computed(() => {
  try {
    const { node } = JSON.parse(oxc.value.astJson) as { node: { sourceType: string } };
    return node.sourceType;
  } catch {
    return "script";
  }
});

const creatingSourcemapLink = ref(false);
const sourcemapLink = computedAsync(
  async () => {
    const generatedCode = oxc.value.codegenText;
    const sourceMapJson = oxc.value.codegenSourcemapText;
    if (!generatedCode || !sourceMapJson) return "";

    // The viewer accepts a deflated JSON payload as a base64url path.
    const payload = JSON.stringify({ generatedCode, sourceMapJson });
    const stream = new Blob([payload]).stream().pipeThrough(new CompressionStream("deflate"));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    const slug = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replace(/=+$/, "");
    return `https://source-map-viewer.void.app/${slug}`;
  },
  "",
  creatingSourcemapLink,
);
</script>

<template>
  <div class="h-full min-h-0 w-full flex flex-col">
    <div class="min-h-0 flex-1 overflow-auto">
      <OutputPreview class="!h-auto" :code="oxc.codegenText" lang="tsx" />
      <a
        v-if="sourcemapLink && !creatingSourcemapLink"
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
      :baseline-code="baselineCode"
      :baseline-source-map="baselineSourcemap"
      :baseline-error="baselineError"
    />
  </div>
</template>
