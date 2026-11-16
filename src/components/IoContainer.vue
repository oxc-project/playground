<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useMediaQuery } from "@vueuse/core";
import { computed, provide, useTemplateRef } from "vue";
import { useOxc } from "~/composables/oxc";
import { sourceNavigationKey } from "~/composables/source-navigation";
import { activeTab, expectedDiffEnabled } from "~/composables/state";
import { Splitter, SplitterPanel, SplitterResizeHandle } from "~/ui/splitter";
import CopyContainer from "./CopyContainer.vue";
import InputEditor from "./input/InputEditor.vue";
import DiagnosticPanel from "./output/DiagnosticPanel.vue";
import Output from "./output/OutputPanel.vue";

const { oxc, error, monacoLanguage, options } = await useOxc();

const isMdAndUp = useMediaQuery("(min-width: 768px)");
const splitterDirection = computed(() => (isMdAndUp.value ? "horizontal" : "vertical"));
const inputRef = useTemplateRef("inputRef");
provide(sourceNavigationKey, (range) => inputRef.value?.revealPositionRange(range));

const errorStr = computed(() => {
  return Array.isArray(error.value)
    ? error.value.map(stringifyError).join("\n")
    : stringifyError(error.value);
});

function stringifyError(error: unknown) {
  if (!error) return "";
  if (error instanceof Error) return [error.message, error.stack].filter(Boolean).join("\n");
  return String(error);
}
</script>

<template>
  <main class="workspace min-h-0 min-w-0 flex flex-1" aria-label="Code workspace">
    <Splitter :direction="splitterDirection" class="min-w-0 flex-1">
      <SplitterPanel :default-size="50" :min-size="20" class="flex flex-col">
        <div class="source-heading flex shrink-0 items-center justify-between gap-3 px-4">
          <div class="flex min-w-0 items-center gap-2 text-xs font-medium">
            <Icon icon="ri:code-s-slash-line" class="h-4 w-4 shrink-0 text-primary" />
            <span class="truncate">test.{{ options.parser.extension }}</span>
          </div>
          <span class="text-xs text-muted-foreground">Source</span>
        </div>
        <div class="h-full min-h-0 min-w-0 flex flex-1 flex-col">
          <div class="min-h-0 flex-1">
            <InputEditor
              ref="inputRef"
              :language="monacoLanguage"
              :filename="`/test.${options.parser.extension}`"
              main
            />
          </div>

          <DiagnosticPanel
            v-if="oxc.getDiagnostics().length"
            :filename="`test.${options.parser.extension}`"
            :get-position-at="inputRef?.getPositionAt"
            @navigate="(start, end) => inputRef?.revealRange(start, end)"
          />
        </div>
      </SplitterPanel>

      <SplitterResizeHandle />

      <SplitterPanel :default-size="50" :min-size="20" class="overflow-hidden">
        <div class="h-full min-w-0 overflow-hidden">
          <!-- Retain editor/runner state through compilation failures. -->
          <Output
            v-show="!error || (activeTab === 'codegen' && expectedDiffEnabled)"
            class="h-full overflow-auto"
          />
          <CopyContainer
            v-if="error && !(activeTab === 'codegen' && expectedDiffEnabled)"
            :value="errorStr || ''"
            class="min-w-0 w-full flex"
          >
            <pre class="h-full overflow-auto p-2 text-sm text-red-400" v-text="errorStr" />
          </CopyContainer>
        </div>
      </SplitterPanel>
    </Splitter>
  </main>
</template>
