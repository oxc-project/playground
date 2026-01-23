<script setup lang="ts">
import { computed, ref } from "vue";
import MonacoEditor from "~/components/MonacoEditor.vue";
import { useOxc } from "~/composables/oxc";
import { Checkbox } from "~/ui/checkbox";
import { Splitter, SplitterPanel, SplitterResizeHandle } from "~/ui/splitter";
import OutputPreview from "./OutputPreview.vue";

const { oxc, options } = await useOxc();
const showOutput = ref(true);
const showIR = ref(false);
const configError = ref<string>("");
// whether the details element is open
const detailsOpen = ref(true);

function onDetailsToggle(e: Event) {
  const t = e.target as HTMLDetailsElement | null;
  detailsOpen.value = !!t?.open;
}

const formatterConfig = computed({
  get: () => {
    try {
      const config = options.value.formatter || {};
      // Filter out undefined values for cleaner JSON
      const cleanConfig = Object.fromEntries(
        Object.entries(config).filter(([, v]) => v !== undefined),
      );
      return JSON.stringify(cleanConfig, null, 2);
    } catch {
      return "{}";
    }
  },
  set: (value: string) => {
    try {
      configError.value = "";
      const parsed = JSON.parse(value);
      options.value.formatter = {
        ...options.value.formatter,
        ...parsed,
      };
    } catch (error) {
      configError.value = error instanceof Error ? error.message : "Invalid JSON";
    }
  },
});
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- Checkbox toolbar -->
    <div class="flex shrink-0 items-center gap-3 border-b border-border px-3 py-2">
      <label class="flex cursor-pointer items-center gap-1.5 text-sm">
        <Checkbox id="show-output" v-model:checked="showOutput" />
        <span :class="showOutput ? 'text-foreground' : 'text-muted-foreground'">Output</span>
      </label>
      <label class="flex cursor-pointer items-center gap-1.5 text-sm">
        <Checkbox id="show-ir" v-model:checked="showIR" />
        <span :class="showIR ? 'text-foreground' : 'text-muted-foreground'">IR</span>
      </label>
    </div>

    <!-- Content area -->
    <div v-if="!showOutput && !showIR" class="flex flex-1 items-center justify-center text-muted-foreground">
      Select at least one output to display
    </div>

    <Splitter v-else-if="showOutput && showIR" direction="horizontal" class="min-h-0 flex-1">
      <SplitterPanel :default-size="50" :min-size="20" class="overflow-hidden">
        <OutputPreview :code="oxc.formatterFormattedText" lang="tsx" />
      </SplitterPanel>

      <SplitterResizeHandle with-handle />

      <SplitterPanel :default-size="50" :min-size="20" class="overflow-hidden">
        <OutputPreview :code="oxc.formatterIrText" lang="typescript" />
      </SplitterPanel>
    </Splitter>

    <div v-else class="min-h-0 flex-1 overflow-auto">
      <OutputPreview :code="showOutput ? oxc.formatterFormattedText : oxc.formatterIrText"
        :lang="showOutput ? 'tsx' : 'typescript'" />
    </div>

    <!-- Configure Options -->
    <details open class="shrink-0 border-t border-border" @toggle="onDetailsToggle($event)">
      <summary :aria-expanded="detailsOpen"
        class="flex cursor-pointer select-none items-center justify-between gap-3 bg-muted px-4 py-2 text-sm font-medium">
        <div>
          Configure Options2222
          <span class="ml-2 text-xs text-muted-foreground">
            {{ detailsOpen ? "(Click to collapse)" : "(Click to expand)" }}
          </span>
        </div>
        <svg class="chev h-4 w-4 text-muted-foreground transition-transform duration-150" viewBox="0 0 20 20"
          fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 8L10 12L14 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </summary>
      <div class="overflow-hidden bg-background" style="height: 300px">
        <MonacoEditor v-model="formatterConfig" language="json" filename="formatter.json" :options="{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
        }" />
        <div v-if="configError" class="px-4 py-2 text-sm text-red-500">
          ⚠️ {{ configError }}
        </div>
      </div>
    </details>
  </div>
</template>

<style scoped>
details summary {
  list-style: none;
}

.chev {
  transform: rotate(-90deg);
}

details[open] .chev {
  transform: rotate(0deg);
}
</style>
