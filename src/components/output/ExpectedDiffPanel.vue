<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useElementSize } from "@vueuse/core";
import * as monaco from "monaco-editor/editor/editor.api";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useOxc } from "~/composables/oxc";
import { activeTab, dark, expectedDiffEnabled, expectedOutput } from "~/composables/state";
import { Button } from "~/ui/button";
import { getEditorTheme, registerEditorThemes } from "~/utils/editor-theme";

const { oxc, compilationErrors } = await useOxc();
const container = ref<HTMLElement>();
const { width } = useElementSize(container);
const viewOverride = ref<"inline" | "split">();
const preferSplit = ref(false);
watch(width, (value) => {
  // Hidden tabs have zero width; keep the previous layout until visible again.
  if (value > 0) preferSplit.value = value >= 800;
});
const split = computed(() =>
  viewOverride.value ? viewOverride.value === "split" : preferSplit.value,
);
const changedBlocks = ref<number>();
const hasExpectation = computed(() => expectedOutput.value !== undefined);
const currentOutput = computed(() => (compilationErrors.value.length ? "" : oxc.value.codegenText));
const matches = computed(() => expectedOutput.value === currentOutput.value);
const canNavigate = computed(
  () =>
    hasExpectation.value &&
    !compilationErrors.value.length &&
    !matches.value &&
    !!changedBlocks.value,
);
let editor: monaco.editor.IStandaloneDiffEditor | undefined;
let currentModel: monaco.editor.ITextModel | undefined;
let expectedModel: monaco.editor.ITextModel | undefined;
const disposables: monaco.IDisposable[] = [];
let disposed = false;
let syncingExpected = false;
let pastedText: string | undefined;
const pastedSelections = new Map<string, string>();
const rangeKey = (range: monaco.IRange) =>
  `${range.startLineNumber}:${range.startColumn}:${range.endLineNumber}:${range.endColumn}`;
const normalizeEol = (value: string) => value.replace(/\r\n?/g, "\n");
const getLineEndings = (value: string) => value.match(/\r\n|\r|\n/g) ?? [];
// Store only changes to line endings, not a document-sized snapshot per keystroke.
// Alternative version IDs let a single undo/redo traverse a whole typing group.
type LineEndingEdit = { start: number; removed: string[]; inserted: string[] };
const lineEndingHistory: { version: number; edits: LineEndingEdit[] }[] = [];
let lineEndings: string[] = [];
let historyIndex = 0;

function replaceLineEndings(start: number, count: number, inserted: string[]) {
  lineEndings = lineEndings.slice(0, start).concat(inserted, lineEndings.slice(start + count));
}

function updateExpected(event: monaco.editor.IModelContentChangedEvent) {
  if (syncingExpected) return;
  changedBlocks.value = undefined;
  const version = expectedModel!.getAlternativeVersionId();
  let value = expectedOutput.value ?? "";
  if (event.isUndoing || event.isRedoing) {
    while (historyIndex > 0 && lineEndingHistory[historyIndex - 1]!.version > version) {
      for (const edit of lineEndingHistory[--historyIndex]!.edits.toReversed()) {
        replaceLineEndings(edit.start, edit.inserted.length, edit.removed);
      }
    }
    while (
      historyIndex < lineEndingHistory.length &&
      lineEndingHistory[historyIndex]!.version <= version
    ) {
      for (const edit of lineEndingHistory[historyIndex++]!.edits) {
        replaceLineEndings(edit.start, edit.removed.length, edit.inserted);
      }
    }
    let index = 0;
    value = expectedModel!
      .getValue(monaco.editor.EndOfLinePreference.LF)
      .replace(/\n/g, () => lineEndings[index++] ?? "\n");
  } else {
    // A new edit after undo discards the corresponding redo metadata too.
    lineEndingHistory.splice(historyIndex);
    const edits: LineEndingEdit[] = [];
    const starts = [0];
    for (const match of value.matchAll(/\r\n|\r|\n/g)) starts.push(match.index + match[0].length);
    for (const { range, text } of event.changes.toSorted((a, b) => b.rangeOffset - a.rangeOffset)) {
      const start = starts[range.startLineNumber - 1]! + range.startColumn - 1;
      const end = starts[range.endLineNumber - 1]! + range.endColumn - 1;
      const rawText = pastedSelections.get(rangeKey(range)) ?? pastedText;
      const inserted =
        rawText !== undefined && normalizeEol(rawText) === normalizeEol(text) ? rawText : text;
      const endingStart = range.startLineNumber - 1;
      const removed = lineEndings.slice(endingStart, range.endLineNumber - 1);
      const insertedEndings = getLineEndings(inserted);
      if (
        removed.length !== insertedEndings.length ||
        removed.some((ending, index) => ending !== insertedEndings[index])
      ) {
        edits.push({ start: endingStart, removed, inserted: insertedEndings });
        replaceLineEndings(endingStart, removed.length, insertedEndings);
      }
      value = value.slice(0, start) + inserted + value.slice(end);
    }
    if (edits.length) {
      lineEndingHistory.push({ version, edits });
      historyIndex++;
    }
  }
  expectedOutput.value = value;
}

function pasteExpected(event: ClipboardEvent) {
  const expected = editor?.getModifiedEditor();
  if (!expected?.hasTextFocus() || !event.clipboardData?.types.includes("text/plain")) return;
  const text = event.clipboardData.getData("text/plain");
  if (!text) return;
  // Use this editor's paste command so Monaco handles whole-line/multicursor paste,
  // cursor placement and undo grouping without routing through another focused editor.
  event.preventDefault();
  event.stopImmediatePropagation();
  pastedText = text;
  let metadata;
  try {
    const data = JSON.parse(event.clipboardData.getData("vscode-editor-data") || "null");
    if (data?.version === 1) metadata = data;
  } catch {
    // Invalid clipboard metadata must not interfere with Monaco's normal paste.
  }
  const selections = (expected.getSelections() ?? []).toSorted(
    monaco.Range.compareRangesUsingStarts,
  );
  const multicursorText =
    Array.isArray(metadata?.multicursorText) &&
    metadata.multicursorText.every((text: unknown) => typeof text === "string")
      ? (metadata.multicursorText as string[])
      : null;
  if (multicursorText?.length === selections.length) {
    selections.forEach((range, index) =>
      pastedSelections.set(rangeKey(range), multicursorText[index]!),
    );
  }
  try {
    expected.trigger("keyboard", "paste", {
      text: pastedText,
      pasteOnNewLine:
        expected.getOption(monaco.editor.EditorOption.emptySelectionClipboard) &&
        !!metadata?.isFromEmptySelection,
      multicursorText,
      mode: metadata?.mode ?? null,
    });
  } finally {
    pastedText = undefined;
    pastedSelections.clear();
  }
}

const visible = computed(() => activeTab.value === "codegen" && expectedDiffEnabled.value);
watch(
  () => (visible.value ? currentOutput.value : undefined),
  (value) => {
    if (value === undefined || !currentModel || currentModel.getValue() === value) return;
    changedBlocks.value = undefined;
    currentModel.setValue(value);
  },
);
watch(expectedOutput, (value) => {
  if (
    expectedModel &&
    expectedModel.getValue(monaco.editor.EndOfLinePreference.LF) !== normalizeEol(value ?? "")
  ) {
    syncingExpected = true;
    try {
      expectedModel.setValue(value ?? "");
      lineEndings = getLineEndings(value ?? "");
      lineEndingHistory.length = 0;
      historyIndex = 0;
    } finally {
      syncingExpected = false;
    }
  }
});
watch(split, (value) => editor?.updateOptions({ renderSideBySide: value }));
watch(dark, (value) => monaco.editor.setTheme(getEditorTheme(value)));
// Keep models, undo and view state when closing comparison or switching tabs.
watch(
  [activeTab, expectedDiffEnabled],
  ([tab, enabled]) => {
    if (tab === "codegen" && enabled) requestAnimationFrame(() => editor?.layout());
  },
  { flush: "post" },
);

onMounted(async () => {
  try {
    await registerEditorThemes();
  } catch (error) {
    console.warn("Failed to load diff highlighting; using the built-in theme:", error);
  }
  if (disposed) return;
  currentModel = monaco.editor.createModel(currentOutput.value, "javascript");
  expectedModel = monaco.editor.createModel(expectedOutput.value ?? "", "javascript");
  editor = monaco.editor.createDiffEditor(container.value!, {
    automaticLayout: true,
    theme: getEditorTheme(dark.value),
    // Keep Expected on the modified side so it is editable in inline view too.
    readOnly: false,
    originalEditable: false,
    originalAriaLabel: "Current output (read only)",
    modifiedAriaLabel: "Expected generated JavaScript",
    renderSideBySide: split.value,
    useInlineViewWhenSpaceIsLimited: false,
    ignoreTrimWhitespace: false,
    renderMarginRevertIcon: false,
    renderGutterMenu: false,
    minimap: { enabled: false },
    fontSize: 13,
    lineHeight: 23,
    fontFamily: `ui-monospace, Menlo, Monaco, "Cascadia Code", "Courier New", monospace`,
    lineNumbersMinChars: 3,
    padding: { top: 16, bottom: 16 },
    scrollBeyondLastLine: false,
    fixedOverflowWidgets: true,
    renderWhitespace: "selection",
  });
  disposables.push(
    expectedModel.onDidChangeContent(updateExpected),
    editor.onDidUpdateDiff(() => {
      const changes = editor!.getLineChanges();
      changedBlocks.value = changes ? changes.length : undefined;
    }),
  );
  lineEndings = getLineEndings(expectedOutput.value ?? "");
  editor.setModel({ original: currentModel, modified: expectedModel });
  expectedModel.updateOptions({ trimAutoWhitespace: false });
  container.value!.addEventListener("paste", pasteExpected, true);
});

function useEmptyExpectation() {
  expectedOutput.value = "";
  editor?.getModifiedEditor().focus();
}

onBeforeUnmount(() => {
  disposed = true;
  container.value?.removeEventListener("paste", pasteExpected, true);
  for (const disposable of disposables) disposable.dispose();
  editor?.dispose();
  currentModel?.dispose();
  expectedModel?.dispose();
});
</script>

<template>
  <section class="h-full min-h-80 flex flex-col" aria-label="Expected output diff">
    <div class="flex min-h-11 shrink-0 flex-wrap items-center gap-1 border-b px-3 py-1.5">
      <span role="status" class="mr-2 text-xs font-medium" aria-live="polite">
        <template v-if="compilationErrors.length">Compilation failed</template>
        <template v-else-if="!hasExpectation">Awaiting expected output</template>
        <template v-else-if="matches">Matches · 0 changed blocks</template>
        <template v-else-if="changedBlocks === undefined">Comparing…</template>
        <template v-else>
          Differs · {{ Math.max(1, changedBlocks) }} changed
          {{ Math.max(1, changedBlocks) === 1 ? "block" : "blocks" }}
        </template>
      </span>
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7"
        aria-label="Previous difference"
        title="Previous difference"
        :disabled="!canNavigate"
        @click="editor?.goToDiff('previous')"
      >
        <Icon icon="ri:arrow-up-line" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7"
        aria-label="Next difference"
        title="Next difference"
        :disabled="!canNavigate"
        @click="editor?.goToDiff('next')"
      >
        <Icon icon="ri:arrow-down-line" />
      </Button>
      <div class="ml-auto flex items-center gap-1" role="group" aria-label="Diff view">
        <Button
          size="sm"
          :variant="!split ? 'secondary' : 'ghost'"
          :aria-pressed="!split"
          @click="viewOverride = 'inline'"
          >Inline</Button
        >
        <Button
          size="sm"
          :variant="split ? 'secondary' : 'ghost'"
          :aria-pressed="split"
          @click="viewOverride = 'split'"
          >Split</Button
        >
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7"
        aria-label="Close expected diff"
        title="Show printed output"
        @click="expectedDiffEnabled = false"
      >
        <Icon icon="ri:close-line" />
      </Button>
    </div>
    <div
      v-if="!hasExpectation"
      class="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b bg-muted/40 px-3 py-2 text-xs"
    >
      <p>Paste expected generated JavaScript into Expected to compare with Current output.</p>
      <Button size="sm" variant="ghost" @click="useEmptyExpectation">Use empty expectation</Button>
    </div>
    <p class="shrink-0 border-b px-3 py-1.5 text-xs text-muted-foreground">
      Exact text comparison, including whitespace. Expected is kept while changing options and tabs.
    </p>
    <div
      v-if="compilationErrors.length"
      class="max-h-32 shrink-0 overflow-auto border-b px-3 py-2 text-xs text-destructive"
      role="alert"
    >
      <p class="font-medium">Cannot compare until compilation succeeds.</p>
      <ul class="mt-1 list-inside list-disc">
        <li v-for="(message, index) in compilationErrors" :key="index">{{ message }}</li>
      </ul>
    </div>
    <p
      v-else-if="hasExpectation && !matches && changedBlocks === 0"
      class="shrink-0 border-b px-3 py-2 text-xs text-muted-foreground"
    >
      Line endings differ.
    </p>
    <div
      class="grid shrink-0 border-b text-xs"
      :class="split ? 'grid-cols-2 divide-x' : 'grid-cols-1'"
    >
      <p v-if="split" class="px-3 py-2 font-medium">
        Current output <span class="font-normal text-muted-foreground">· read only</span>
      </p>
      <p class="px-3 py-2 font-medium">
        <span v-if="!split" class="font-normal text-muted-foreground">Current output → </span>
        Expected <span class="font-normal text-muted-foreground">· editable</span>
      </p>
    </div>
    <div ref="container" class="min-h-0 min-w-0 flex-1" />
  </section>
</template>
