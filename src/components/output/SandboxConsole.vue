<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from "vue";
import type { SandboxEntry } from "~/composables/sandbox-run";

const props = defineProps<{
  entries: SandboxEntry[];
  label: string;
}>();

const log = useTemplateRef<HTMLDivElement>("log");

watch(
  () => props.entries.at(-1),
  async () => {
    // Follow new output unless the console is collapsed or the user scrolled up.
    const node = log.value;
    if (node && node.offsetParent === null) return;
    const atBottom = !node || node.scrollHeight - node.scrollTop - node.clientHeight < 24;
    await nextTick();
    if (atBottom && log.value) log.value.scrollTop = log.value.scrollHeight;
  },
);
</script>

<template>
  <div
    ref="log"
    role="log"
    :aria-label="label"
    aria-live="polite"
    class="max-h-[50vh] min-h-16 resize-y overflow-auto px-3 py-2 text-xs font-mono"
  >
    <div
      v-for="(entry, index) in entries"
      :key="index"
      class="whitespace-pre-wrap break-words py-0.5"
      :class="{
        'text-destructive': entry.level === 'error',
        'text-amber-600 dark:text-amber-400': entry.level === 'warn',
      }"
    >
      {{ entry.text }}
    </div>
    <p v-if="!entries.length" class="text-muted-foreground">No console output.</p>
  </div>
</template>
