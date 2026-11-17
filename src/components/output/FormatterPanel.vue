<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useElementSize } from "@vueuse/core";
import { computed, ref, toRef, useTemplateRef, watchEffect } from "vue";
import MonacoEditor from "~/components/MonacoEditor.vue";
import { defaultFormatterConfig, useOxc } from "~/composables/oxc";
import { usePrettier } from "~/composables/prettier";
import { useTextDraft } from "~/composables/text-draft";
import { editorValue, formatterPanels } from "~/composables/state";
import { Button } from "~/ui/button";
import { Checkbox } from "~/ui/checkbox";
import { Splitter, SplitterPanel, SplitterResizeHandle } from "~/ui/splitter";
import type { ShikiLang } from "~/utils/shiki";
import OutputPreview from "./OutputPreview.vue";

const { oxc, options } = await useOxc();
const {
  prettierOutput,
  prettierDocOutput,
  prettierError,
  prettierVersion,
  format: formatPrettier,
} = await usePrettier();

// Use shared state for URL persistence
const showOutput = toRef(formatterPanels, "output");
const showIR = toRef(formatterPanels, "ir");
const showPrettier = toRef(formatterPanels, "prettier");
const showPrettierDoc = toRef(formatterPanels, "prettierDoc");
const configError = ref<string>("");
const configEditorMounted = ref(false);
const formatterPanel = useTemplateRef("formatterPanel");
const { width: panelWidth } = useElementSize(formatterPanel);
const splitterDirection = computed(() => (panelWidth.value < 560 ? "vertical" : "horizontal"));

// Compare Oxfmt output with Prettier output (null = comparison not available)
const hasDiff = computed(() => {
  if (!showPrettier.value || prettierError.value) return null;
  return oxc.value.formatterFormattedText !== prettierOutput.value;
});

// JSDoc type casts are only handled by the babel parser, so match it to the input language
const prettierParser = computed(() =>
  ["ts", "mts", "cts", "tsx"].includes(options.value.parser.extension.split(".").pop()!)
    ? "typescript"
    : "babel",
);

// Run Prettier when code, options, or checkboxes change
watchEffect(async () => {
  if (!showPrettier.value && !showPrettierDoc.value) return;
  const opts = options.value.formatter;
  await formatPrettier(editorValue.value, {
    parser: prettierParser.value,
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
});

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
    panels.push({
      key: "output",
      label: "Output",
      code: oxc.value.formatterFormattedText,
      lang: "tsx",
    });
  }
  if (showPrettier.value) {
    panels.push({
      key: "prettier",
      label: `Prettier v${prettierVersion} · ${prettierParser.value}`,
      code: prettierOutput.value,
      lang: "tsx",
    });
  }
  if (showIR.value) {
    panels.push({ key: "ir", label: "IR", code: oxc.value.formatterIrText, lang: "typescript" });
  }
  if (showPrettierDoc.value) {
    panels.push({
      key: "prettier-doc",
      label: "Prettier Doc",
      code: prettierDocOutput.value,
      lang: "typescript",
    });
  }
  return panels;
});

function onDetailsToggle(event: Event) {
  // Mount on first use, then preserve JSON drafts while the disclosure is closed.
  if (event.target instanceof HTMLDetailsElement && event.target.open) {
    configEditorMounted.value = true;
  }
}

function openDiffReport() {
  // Only include config options that differ from defaults
  const currentConfig = options.value.formatter;
  const changedConfig: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(currentConfig)) {
    if (value !== defaultFormatterConfig[key as keyof typeof defaultFormatterConfig]) {
      changedConfig[key] = value;
    }
  }
  const config = JSON.stringify(changedConfig, null, 2);
  const playgroundUrl = window.location.href;

  // Field IDs from formatter_diff_report.yaml template
  const url = new URL("https://github.com/oxc-project/oxc/issues/new");
  url.searchParams.set("template", "formatter_diff_report.yaml");
  url.searchParams.set("input", "```tsx\n" + editorValue.value + "\n```");
  url.searchParams.set("config", "```jsonc\n" + config + "\n```");
  url.searchParams.set(
    "actual",
    "Oxfmt version: `latest`\n```tsx\n" + oxc.value.formatterFormattedText + "\n```",
  );
  url.searchParams.set("oxfmt_playground", playgroundUrl);
  url.searchParams.set(
    "expect",
    `Prettier version: \`${prettierVersion}\`\n\`\`\`tsx\n` + prettierOutput.value + "\n```",
  );

  window.open(url.toString(), "_blank");
}

const formatterConfig = useTextDraft(
  () => {
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
  (value: string) => {
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
);
</script>

<template>
  <div ref="formatterPanel" class="formatter-panel flex h-full min-h-0 flex-col overflow-hidden">
    <div
      class="formatter-toolbar flex shrink-0 flex-wrap items-center gap-x-3 border-b px-3 py-1.5"
    >
      <div class="flex flex-wrap items-center gap-x-3" role="group" aria-label="Formatter outputs">
        <label class="formatter-output-toggle">
          <Checkbox id="show-output" v-model:checked="showOutput" />
          <span :class="showOutput ? 'text-foreground' : 'text-muted-foreground'">Output</span>
        </label>
        <label class="formatter-output-toggle" :title="`Prettier v${prettierVersion}`">
          <Checkbox id="show-prettier" v-model:checked="showPrettier" />
          <span :class="showPrettier ? 'text-foreground' : 'text-muted-foreground'">Prettier</span>
        </label>
        <label class="formatter-output-toggle" title="Oxfmt intermediate representation">
          <Checkbox id="show-ir" v-model:checked="showIR" />
          <span :class="showIR ? 'text-foreground' : 'text-muted-foreground'">IR</span>
        </label>
        <label class="formatter-output-toggle">
          <Checkbox id="show-prettier-doc" v-model:checked="showPrettierDoc" />
          <span :class="showPrettierDoc ? 'text-foreground' : 'text-muted-foreground'"
            >Prettier Doc</span
          >
        </label>
      </div>
      <div v-if="hasDiff !== null" class="ml-auto flex min-h-7 items-center gap-2">
        <span
          class="text-xs font-medium"
          :class="
            hasDiff ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
          "
          role="status"
          :title="
            hasDiff ? 'Oxfmt and Prettier outputs differ' : 'Oxfmt and Prettier outputs match'
          "
          >{{ hasDiff ? "Diff" : "Match" }}</span
        >
        <Button v-if="hasDiff" variant="ghost" size="xs" class="text-xs" @click="openDiffReport">
          <Icon icon="octicon:issue-opened-16" />
          Report diff
        </Button>
      </div>
    </div>

    <!-- Error display -->
    <div
      v-if="prettierError"
      class="shrink-0 border-b border-border bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
    >
      Prettier error: {{ prettierError }}
    </div>

    <div
      v-if="visiblePanels.length === 0"
      class="flex min-h-0 flex-1 items-center justify-center px-4 text-center text-xs text-muted-foreground"
    >
      Select an output to display
    </div>

    <div v-else-if="visiblePanels.length === 1" class="min-h-0 flex-1 overflow-auto">
      <OutputPreview :code="visiblePanels[0].code" :lang="visiblePanels[0].lang" />
    </div>

    <div v-else class="min-h-0 flex-1 overflow-auto" aria-label="Formatter comparisons">
      <Splitter
        :key="`${splitterDirection}-${visiblePanels.map((p) => p.key).join('-')}`"
        :direction="splitterDirection"
        class="h-full min-w-0"
        :style="
          splitterDirection === 'vertical'
            ? { minHeight: `${visiblePanels.length * 160}px` }
            : undefined
        "
      >
        <template v-for="(panel, index) in visiblePanels" :key="panel.key">
          <SplitterResizeHandle v-if="index > 0" with-handle />
          <SplitterPanel
            :default-size="100 / visiblePanels.length"
            :min-size="15"
            class="flex min-w-0 flex-col overflow-hidden"
          >
            <div
              class="shrink-0 truncate border-b bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground"
              :title="panel.label"
            >
              {{ panel.label }}
            </div>
            <div class="min-h-0 flex-1">
              <OutputPreview :code="panel.code" :lang="panel.lang" />
            </div>
          </SplitterPanel>
        </template>
      </Splitter>
    </div>

    <details class="formatter-options shrink-0 border-t" @toggle="onDetailsToggle">
      <summary
        class="flex min-h-9 cursor-pointer select-none items-center gap-2 px-3 text-xs font-medium hover:bg-muted/40"
      >
        <Icon icon="ri:settings-3-line" class="h-3.5 w-3.5 text-muted-foreground" />
        <span>Formatter options</span>
        <span v-if="configError" class="ml-auto text-destructive">Invalid JSON</span>
        <span v-else class="ml-auto font-normal text-muted-foreground">JSON</span>
        <Icon
          icon="ri:arrow-right-s-line"
          class="formatter-options-chevron h-4 w-4 text-muted-foreground"
        />
      </summary>
      <div class="formatter-config-content flex flex-col overflow-hidden border-t bg-background">
        <div class="min-h-0 flex-1">
          <MonacoEditor
            v-if="configEditorMounted"
            v-model="formatterConfig"
            language="json"
            filename="formatter.json"
            :options="{ wordWrap: 'on' }"
          />
        </div>
        <p
          v-if="configError"
          role="alert"
          class="shrink-0 border-t px-3 py-2 text-xs text-destructive"
        >
          {{ configError }}
        </p>
      </div>
    </details>
  </div>
</template>

<style scoped>
.formatter-panel {
  container-type: size;
}

.formatter-output-toggle {
  display: flex;
  min-height: 28px;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  cursor: pointer;
}

.formatter-output-toggle :deep([role="checkbox"]) {
  height: 14px;
  width: 14px;
  border-radius: 3px;
}

.formatter-output-toggle :deep([role="checkbox"] svg) {
  height: 12px;
  width: 12px;
}

.formatter-options summary {
  list-style: none;
}

.formatter-options summary::-webkit-details-marker {
  display: none;
}

.formatter-config-content {
  height: min(240px, 40cqh);
}

.formatter-options-chevron {
  transition: transform 150ms;
}

.formatter-options[open] .formatter-options-chevron {
  transform: rotate(90deg);
}

@media (pointer: coarse) {
  .formatter-output-toggle {
    min-height: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .formatter-options-chevron {
    transition: none;
  }
}
</style>
