<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computedAsync, useClipboard } from "@vueuse/core";
import { computed, ref } from "vue";
import { useOxc } from "~/composables/oxc";
import { editorValue } from "~/composables/state";
import { Button } from "~/ui/button";
import ExecutionPanel from "./ExecutionPanel.vue";
import PrintedEditor from "./PrintedEditor.vue";

const { oxc, options, baselineCode, baselineSourcemap, baselineError } = await useOxc();
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

    // Keep generated code and the map in the fragment to avoid HTTP URL limits.
    // No stored share is created. Encoding: UTF-8 JSON -> deflate -> base64url.
    // https://github.com/Dunqing/source-map-viewer/blob/main/src/composables/useShareableUrl.ts
    const payload = JSON.stringify({ generatedCode, sourceMapJson });
    const stream = new Blob([payload]).stream().pipeThrough(new CompressionStream("deflate"));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    const slug = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replace(/=+$/, "");
    return `https://source-map-viewer.void.app/#data=${slug}`;
  },
  "",
  creatingSourcemapLink,
);
const sourceMapReady = computed(() => !!sourcemapLink.value && !creatingSourcemapLink.value);
const { copied, copy } = useClipboard();
</script>

<template>
  <ExecutionPanel
    :code="oxc.codegenText"
    :source-type="sourceType"
    :source-map="oxc.codegenSourcemapText"
    :baseline-code="baselineCode"
    :baseline-source-map="baselineSourcemap"
    :baseline-error="baselineError"
  >
    <template #actions>
      <Button
        as="a"
        role="link"
        variant="ghost"
        size="sm"
        class="output-source-map aria-disabled:pointer-events-none aria-disabled:opacity-50"
        :href="sourceMapReady ? sourcemapLink : undefined"
        :aria-disabled="!sourceMapReady"
        :tabindex="sourceMapReady ? 0 : -1"
        aria-label="Visualize source map (opens in a new tab)"
        title="Visualize source map (opens in a new tab)"
        target="_blank"
        rel="noopener"
      >
        <Icon icon="ri:arrow-right-up-line" />
        <span class="output-source-map-label">Source map</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7"
        :disabled="!oxc.codegenText"
        :aria-label="copied ? 'Copied output' : 'Copy output'"
        :title="copied ? 'Copied output' : 'Copy output'"
        @click="copy(oxc.codegenText)"
      >
        <Icon
          :icon="copied ? 'ri:check-line' : 'ri:file-copy-line'"
          :class="{ 'text-green-500': copied }"
        />
      </Button>
    </template>
    <PrintedEditor
      :key="options.parser.extension"
      :extension="options.parser.extension"
      :code="oxc.codegenText"
      :source-map="oxc.codegenSourcemapText ?? ''"
      :source="editorValue"
    />
  </ExecutionPanel>
</template>
