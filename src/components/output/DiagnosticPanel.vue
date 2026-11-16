<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, useId, watch } from "vue";
import { useOxc } from "~/composables/oxc";
import { editorValue } from "~/composables/state";
import DiagnosticCodeframe from "./DiagnosticCodeframe.vue";

const props = defineProps<{
  filename: string;
  getPositionAt?: (offset: number) => { lineNumber: number; column: number } | undefined;
}>();
const emit = defineEmits<{
  navigate: [start: number, end: number];
}>();

const { oxc } = await useOxc();
const collapsed = ref(false);
const expanded = ref(new Set<number>());
const listId = useId();
const severityStyles = {
  Error: { icon: "ri:close-circle-line", color: "text-destructive" },
  Warning: { icon: "ri:error-warning-line", color: "text-amber-700 dark:text-amber-400" },
  Advice: { icon: "ri:information-line", color: "text-primary" },
};
const diagnostics = computed(() =>
  oxc.value.getDiagnostics().map((diagnostic) => {
    const label = diagnostic.labels[0];
    return {
      ...diagnostic,
      label,
      position: label && props.getPositionAt?.(label.start),
      ...severityStyles[diagnostic.severity],
    };
  }),
);
const errors = computed(() => diagnostics.value.filter((d) => d.severity === "Error").length);
const warnings = computed(() => diagnostics.value.filter((d) => d.severity === "Warning").length);
const advice = computed(() => diagnostics.value.filter((d) => d.severity === "Advice").length);

// A new compiler result may reorder diagnostics; don't expand an unrelated item.
watch(diagnostics, () => expanded.value.clear());

function toggleDetails(index: number) {
  if (expanded.value.has(index)) expanded.value.delete(index);
  else expanded.value.add(index);
}
</script>

<template>
  <section
    aria-label="Diagnostics"
    class="diagnostic-panel min-h-0 shrink-0 flex flex-col border-t"
  >
    <button
      type="button"
      class="diagnostic-toggle flex shrink-0 items-center gap-2 px-3 py-2 text-left text-xs hover:bg-muted focus-visible:-outline-offset-2"
      :aria-expanded="!collapsed"
      :aria-controls="listId"
      @click="collapsed = !collapsed"
    >
      <Icon
        :icon="collapsed ? 'ri:arrow-right-s-line' : 'ri:arrow-down-s-line'"
        class="h-4 w-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span class="font-medium">Diagnostics</span>
      <span role="status" class="ml-auto flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
        <span v-if="errors" class="flex items-center gap-1">
          <Icon
            icon="ri:close-circle-line"
            class="h-3.5 w-3.5 text-destructive"
            aria-hidden="true"
          />
          {{ errors }} {{ errors === 1 ? "error" : "errors" }}
        </span>
        <span v-if="warnings" class="flex items-center gap-1">
          <Icon
            icon="ri:error-warning-line"
            class="h-3.5 w-3.5 text-amber-700 dark:text-amber-400"
            aria-hidden="true"
          />
          {{ warnings }} {{ warnings === 1 ? "warning" : "warnings" }}
        </span>
        <span v-if="advice">{{ advice }} advice</span>
      </span>
    </button>

    <ul :id="listId" v-show="!collapsed" class="min-h-0 overflow-auto border-t">
      <li
        v-for="(diagnostic, i) in diagnostics"
        :key="i"
        class="diagnostic-item border-b last:border-b-0"
      >
        <div class="flex flex-wrap items-start gap-1 px-2 py-1">
          <button
            type="button"
            class="diagnostic-location min-w-0 flex flex-1 basis-80 items-start gap-2 rounded px-1 py-1.5 text-left text-xs hover:bg-muted focus-visible:-outline-offset-2 disabled:cursor-default"
            :disabled="!diagnostic.position"
            :title="
              diagnostic.position ? 'Go to source: ' + diagnostic.message : diagnostic.message
            "
            :aria-label="`${diagnostic.severity}: ${diagnostic.message}${diagnostic.position ? `. ${filename}, line ${diagnostic.position.lineNumber}, column ${diagnostic.position.column}. Go to source` : ''}`"
            @click="
              diagnostic.label && emit('navigate', diagnostic.label.start, diagnostic.label.end)
            "
          >
            <Icon
              :icon="diagnostic.icon"
              class="mt-0.5 h-3.5 w-3.5 shrink-0"
              :class="diagnostic.color"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1 break-words">{{ diagnostic.message }}</span>
            <span
              v-if="diagnostic.position"
              class="diagnostic-position shrink-0 font-mono text-primary underline decoration-primary/40 underline-offset-2"
              aria-hidden="true"
            >
              {{ filename }}:{{ diagnostic.position.lineNumber }}:{{ diagnostic.position.column }}
            </span>
          </button>
          <button
            v-if="diagnostic.codeframe || diagnostic.helpMessage"
            type="button"
            class="diagnostic-details ml-auto flex shrink-0 items-center gap-1 rounded px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:-outline-offset-2"
            :aria-expanded="expanded.has(i)"
            :aria-controls="`${listId}-${i}`"
            @click="toggleDetails(i)"
          >
            <Icon
              :icon="expanded.has(i) ? 'ri:arrow-down-s-line' : 'ri:arrow-right-s-line'"
              class="h-3.5 w-3.5"
              aria-hidden="true"
            />
            <span>{{ expanded.has(i) ? "Hide details" : "Show details" }}</span>
            <span class="sr-only"> for {{ diagnostic.message }}</span>
          </button>
        </div>
        <div
          v-if="diagnostic.codeframe || diagnostic.helpMessage"
          :id="`${listId}-${i}`"
          v-show="expanded.has(i)"
          class="mx-3 mb-2"
        >
          <DiagnosticCodeframe
            v-if="expanded.has(i) && diagnostic.codeframe"
            :codeframe="diagnostic.codeframe"
            :source="editorValue"
            :severity-color="diagnostic.color"
            :aria-label="`Full diagnostic: ${diagnostic.message}`"
          />
          <p v-else-if="!diagnostic.codeframe" class="px-1 text-xs text-muted-foreground">
            {{ diagnostic.helpMessage }}
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.diagnostic-panel {
  max-height: min(45%, 20rem);
  background: hsl(var(--background));
}

.diagnostic-location {
  overflow-wrap: anywhere;
}
</style>
