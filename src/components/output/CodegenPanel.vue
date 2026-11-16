<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computedAsync, useClipboard } from "@vueuse/core";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from "radix-vue";
import { computed, ref, useId } from "vue";
import { useOxc } from "~/composables/oxc";
import { expectedDiffEnabled } from "~/composables/state";
import { Button } from "~/ui/button";
import ExecutionPanel from "./ExecutionPanel.vue";
import ExpectedDiffPanel from "./ExpectedDiffPanel.vue";
import OutputPreview from "./OutputPreview.vue";

const { oxc, baselineCode, baselineSourcemap, baselineError } = await useOxc();
const expectedDiffVisited = ref(expectedDiffEnabled.value);
const expectedDiffId = useId();
function showExpectedDiff() {
  expectedDiffVisited.value = true;
  expectedDiffEnabled.value = true;
}
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
        class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
        :href="sourceMapReady ? sourcemapLink : undefined"
        :aria-disabled="!sourceMapReady"
        :tabindex="sourceMapReady ? 0 : -1"
        aria-label="Visualize source map (opens in a new tab)"
        title="Visualize source map (opens in a new tab)"
        target="_blank"
        rel="noopener"
      >
        <Icon icon="ri:arrow-right-up-line" />
        <span class="hidden xl:inline">Source map</span>
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
      <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7"
            aria-label="More output actions"
            title="More output actions"
          >
            <Icon icon="ri:more-2-fill" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            :side-offset="6"
            class="z-50 min-w-52 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          >
            <DropdownMenuItem
              v-if="!expectedDiffEnabled"
              class="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
              :aria-controls="expectedDiffId"
              @select="showExpectedDiff"
            >
              <Icon icon="ri:file-search-line" />
              Compare expected output…
            </DropdownMenuItem>
            <DropdownMenuItem
              v-else
              class="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
              @select="expectedDiffEnabled = false"
            >
              <Icon icon="ri:code-s-slash-line" />
              Show printed output
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </template>
    <OutputPreview
      v-show="!expectedDiffEnabled"
      class="!h-auto"
      :code="oxc.codegenText"
      lang="tsx"
      hide-copy
    />
    <ExpectedDiffPanel
      v-if="expectedDiffVisited"
      v-show="expectedDiffEnabled"
      :id="expectedDiffId"
    />
  </ExecutionPanel>
</template>
