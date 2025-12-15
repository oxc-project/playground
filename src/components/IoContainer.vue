<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { computed } from "vue";
import { useOxc } from "~/composables/oxc";
import { Splitter, SplitterPanel, SplitterResizeHandle } from "~/ui/splitter";
import CopyContainer from "./CopyContainer.vue";
import InputEditor from "./input/InputEditor.vue";
import DiagnosticPanel from "./output/DiagnosticPanel.vue";
import Output from "./output/OutputPanel.vue";

const { oxc, error, monacoLanguage, options } = await useOxc();

const isMdAndUp = useMediaQuery("(min-width: 768px)");
const splitterDirection = computed(() =>
  isMdAndUp.value ? "horizontal" : "vertical",
);

const errorStr = computed(() => {
  return Array.isArray(error.value)
    ? error.value.map(stringifyError).join("\n")
    : stringifyError(error.value);
});

function stringifyError(error: unknown) {
  if (!error) return "";
  if (error instanceof Error)
    return [error.message, error.stack].filter(Boolean).join("\n");
  return String(error);
}
</script>

<template>
  <main class="min-h-0 flex flex-1">
    <Splitter :direction="splitterDirection" class="flex-1">
      <SplitterPanel :default-size="50" :min-size="20" class="flex flex-col">
        <div class="h-full min-w-0 flex flex-1 flex-col pt-2">
          <div class="min-h-50vh flex-grow-2 flex-basis-none">
            <InputEditor
              :language="monacoLanguage"
              :filename="`/test.${options.parser.extension}`"
              main
            />
          </div>

          <div
            v-if="oxc.getDiagnostics().length"
            class="min-h-0 flex flex-1 flex-col gap2 overflow-auto border-t px-3 py-2 text-sm font-mono op80"
          >
            <DiagnosticPanel />
          </div>
        </div>
      </SplitterPanel>

      <SplitterResizeHandle />

      <SplitterPanel :default-size="50" :min-size="20" class="overflow-hidden">
        <div class="h-full min-w-0 overflow-hidden">
          <Output v-if="!error" class="h-full overflow-auto" />
          <CopyContainer
            v-else
            :value="errorStr || ''"
            class="min-w-0 w-full flex"
          >
            <pre
              class="h-full overflow-auto p-2 text-sm text-red-400"
              v-text="errorStr"
            />
          </CopyContainer>
        </div>
      </SplitterPanel>
    </Splitter>
  </main>
</template>
