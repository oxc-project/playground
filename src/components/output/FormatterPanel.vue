<script setup lang="ts">
import { computed, ref, watch } from "vue";
import MonacoEditor from "~/components/MonacoEditor.vue";
import { useOxc } from "~/composables/oxc";
import { usePrettier } from "~/composables/prettier";
import { editorValue, formatterPanels } from "~/composables/state";
import { Checkbox } from "~/ui/checkbox";
import { Splitter, SplitterPanel, SplitterResizeHandle } from "~/ui/splitter";
import type { ShikiLang } from "~/utils/shiki";
import OutputPreview from "./OutputPreview.vue";

const { oxc, options } = await useOxc();
const { prettierOutput, prettierDocOutput, prettierError, prettierVersion, format: formatPrettier } = await usePrettier();

// Use shared state for URL persistence
const showOutput = computed({
  get: () => formatterPanels.value.output,
  set: (v) => (formatterPanels.value.output = v),
});
const showIR = computed({
  get: () => formatterPanels.value.ir,
  set: (v) => (formatterPanels.value.ir = v),
});
const showPrettier = computed({
  get: () => formatterPanels.value.prettier,
  set: (v) => (formatterPanels.value.prettier = v),
});
const showPrettierDoc = computed({
  get: () => formatterPanels.value.prettierDoc,
  set: (v) => (formatterPanels.value.prettierDoc = v),
});
const configError = ref<string>("");
// whether the details element is open
const detailsOpen = ref(true);

// Helper to run Prettier with current options
async function runPrettier() {
  if (!showPrettier.value && !showPrettierDoc.value) return;
  const opts = options.value.formatter;
  await formatPrettier(editorValue.value, {
    tabWidth: opts.tabWidth,
    useTabs: opts.useTabs,
    printWidth: opts.printWidth,
    semi: opts.semi,
    singleQuote: opts.singleQuote,
    trailingComma: opts.trailingComma as "all" | "es5" | "none",
    bracketSpacing: opts.bracketSpacing,
    bracketSameLine: opts.bracketSameLine,
    arrowParens: opts.arrowParens as "always" | "avoid",
    singleAttributePerLine: opts.singleAttributePerLine,
    jsxSingleQuote: opts.jsxSingleQuote,
  });
}

// Run Prettier when code or options change (only if checkbox is checked)
watch([editorValue, () => options.value.formatter], runPrettier, { deep: true });
// Run Prettier when checkbox is checked (immediate for URL restore)
watch([showPrettier, showPrettierDoc], runPrettier, { immediate: true });

// Compute visible panels for dynamic layout
interface Panel {
  key: string;
  label: string;
  code: string;
  lang: ShikiLang;
}

const visiblePanels = computed<Panel[]>(() => {
  const panels: Panel[] = [];
  if (showOutput.value) {
    panels.push({ key: "output", label: "Output", code: oxc.value.formatterFormattedText, lang: "tsx" });
  }
  if (showPrettier.value) {
    panels.push({ key: "prettier", label: "Prettier", code: prettierOutput.value, lang: "tsx" });
  }
  if (showIR.value) {
    panels.push({ key: "ir", label: "IR", code: oxc.value.formatterIrText, lang: "typescript" });
  }
  if (showPrettierDoc.value) {
    panels.push({ key: "prettier-doc", label: "Prettier Doc", code: prettierDocOutput.value, lang: "typescript" });
  }
  return panels;
});

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
    <div class="flex shrink-0 flex-wrap items-center gap-3 border-b border-border px-3 py-2">
      <label class="flex cursor-pointer items-center gap-1.5 text-sm">
        <Checkbox id="show-output" v-model:checked="showOutput" />
        <span :class="showOutput ? 'text-foreground' : 'text-muted-foreground'">Output</span>
      </label>
      <label class="flex cursor-pointer items-center gap-1.5 text-sm">
        <Checkbox id="show-prettier" v-model:checked="showPrettier" />
        <span :class="showPrettier ? 'text-foreground' : 'text-muted-foreground'">Prettier</span>
        <span class="text-xs text-muted-foreground">v{{ prettierVersion }}</span>
      </label>
      <label class="flex cursor-pointer items-center gap-1.5 text-sm">
        <Checkbox id="show-ir" v-model:checked="showIR" />
        <span :class="showIR ? 'text-foreground' : 'text-muted-foreground'">IR</span>
      </label>
      <label class="flex cursor-pointer items-center gap-1.5 text-sm">
        <Checkbox id="show-prettier-doc" v-model:checked="showPrettierDoc" />
        <span :class="showPrettierDoc ? 'text-foreground' : 'text-muted-foreground'">Prettier Doc</span>
      </label>
    </div>

    <!-- Error display -->
    <div v-if="prettierError" class="shrink-0 border-b border-border bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
      Prettier error: {{ prettierError }}
    </div>

    <!-- Content area -->
    <div v-if="visiblePanels.length === 0" class="flex flex-1 items-center justify-center text-muted-foreground">
      Select at least one output to display
    </div>

    <!-- Single panel -->
    <div v-else-if="visiblePanels.length === 1" class="min-h-0 flex-1 overflow-auto">
      <OutputPreview :code="visiblePanels[0].code" :lang="visiblePanels[0].lang" />
    </div>

    <!-- Multiple panels with splitter -->
    <Splitter v-else :key="visiblePanels.map(p => p.key).join('-')" direction="horizontal" class="min-h-0 flex-1">
      <template v-for="(panel, index) in visiblePanels" :key="panel.key">
        <SplitterResizeHandle v-if="index > 0" with-handle />
        <SplitterPanel :default-size="100 / visiblePanels.length" :min-size="15" class="flex flex-col overflow-hidden">
          <div class="shrink-0 border-b border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {{ panel.label }}
          </div>
          <div class="min-h-0 flex-1">
            <OutputPreview :code="panel.code" :lang="panel.lang" />
          </div>
        </SplitterPanel>
      </template>
    </Splitter>

    <!-- Configure Options -->
    <details open class="shrink-0 border-t border-border" @toggle="onDetailsToggle($event)">
      <summary :aria-expanded="detailsOpen"
        class="flex cursor-pointer select-none items-center justify-between gap-3 bg-muted px-4 py-2 text-sm font-medium">
        <div>
          Configure Options
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
