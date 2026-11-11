<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, onBeforeUnmount, ref, useId, useTemplateRef, watch } from "vue";
import { Button } from "~/ui/button";
import { createRunnerDocument, getRunDisabledReason } from "~/utils/output-runner";

const props = defineProps<{
  code: string;
  sourceType: string;
  sourceMap?: string;
  disabled?: boolean;
}>();

type Status = "idle" | "running" | "complete" | "error" | "stopped";
type Entry = { text: string; level: string };
const status = ref<Status>("idle");
const entries = ref<Entry[]>([]);
const expanded = ref(false);
const document = ref("");
const runId = ref(0);
const topLevelComplete = ref(false);
const pendingTimers = ref(0);
const sandbox = useTemplateRef<HTMLIFrameElement>("sandbox");
const tipId = useId();
const disabledReason = computed(() => getRunDisabledReason(props.code, props.sourceType));

// "Finished" means the synchronous code and every timer it scheduled are done.
// Pending timers keep the run in the running state.
function syncStatus() {
  if (status.value === "error" || status.value === "stopped" || status.value === "idle") return;
  status.value = topLevelComplete.value && pendingTimers.value === 0 ? "complete" : "running";
}

function append(text: string, level: string) {
  entries.value.push({ text, level });
  if (entries.value.length > 500) entries.value.shift();
}

function stop() {
  document.value = "";
  if (status.value === "running" || status.value === "complete") status.value = "stopped";
}

function run() {
  stop();
  expanded.value = true;
  entries.value = [];
  status.value = "running";
  runId.value++;
  topLevelComplete.value = false;
  pendingTimers.value = 0;
  try {
    document.value = createRunnerDocument(props.code, props.sourceType, props.sourceMap);
  } catch (error) {
    append(error instanceof Error ? error.message : String(error), "error");
    status.value = "error";
  }
}

function receive(event: MessageEvent) {
  if (!sandbox.value || event.source !== sandbox.value.contentWindow) return;
  const data = event.data;
  if (!data || data.channel !== "oxc-output-runner") return;
  switch (data.type) {
    case "console":
    case "error":
      if (typeof data.text !== "string" || typeof data.level !== "string") return;
      append(data.text, data.level);
      if (data.type === "error") status.value = "error";
      break;
    case "activity":
      if (typeof data.pendingTimers !== "number" || typeof data.topLevelComplete !== "boolean") {
        return;
      }
      pendingTimers.value = Math.max(0, data.pendingTimers);
      topLevelComplete.value = data.topLevelComplete;
      syncStatus();
      break;
  }
}

window.addEventListener("message", receive);
onBeforeUnmount(() => window.removeEventListener("message", receive));
watch(
  [() => props.code, () => props.sourceType, () => props.sourceMap, () => props.disabled],
  () => {
    stop();
    status.value = "idle";
    entries.value = [];
    topLevelComplete.value = false;
    pendingTimers.value = 0;
  },
);

function close() {
  stop();
  expanded.value = false;
}
</script>

<template>
  <section class="shrink-0 border-t" aria-label="Output execution">
    <div class="flex items-center gap-2 px-2 py-1.5">
      <Button
        size="sm"
        variant="outline"
        :disabled="disabled || !code || !!disabledReason"
        :aria-describedby="disabledReason ? tipId : undefined"
        @click="run"
      >
        <Icon icon="ri:play-line" />
        Run output
      </Button>
      <Button v-if="document && status !== 'complete'" size="sm" variant="ghost" @click="stop">
        Stop
      </Button>
      <span v-if="expanded" class="text-xs text-muted-foreground" role="status">
        {{
          {
            idle: "Output changed — run again",
            running: "Running…",
            complete: "Finished",
            error: "Failed",
            stopped: "Stopped",
          }[status]
        }}
      </span>
      <div v-if="expanded" class="ml-auto flex items-center gap-1">
        <Button size="sm" variant="ghost" @click="entries = []">Clear console</Button>
        <Button
          size="icon"
          variant="ghost"
          class="h-7 w-7"
          aria-label="Close console"
          @click="close"
        >
          <Icon icon="ri:close-line" />
        </Button>
      </div>
    </div>
    <p v-if="disabledReason" :id="tipId" class="px-3 pb-2 text-xs text-muted-foreground">
      {{ disabledReason }}
    </p>
    <div
      v-if="expanded"
      class="max-h-56 min-h-16 overflow-auto border-t px-3 py-2 text-xs font-mono"
      role="log"
      aria-label="Execution console"
      aria-live="polite"
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
      <p v-if="!entries.length" class="text-muted-foreground">
        {{ status === "running" ? "Waiting for output…" : "No console output." }}
      </p>
    </div>
    <iframe
      v-if="document"
      :key="runId"
      ref="sandbox"
      :srcdoc="document"
      sandbox="allow-scripts"
      title="Output execution sandbox"
      class="hidden"
    />
  </section>
</template>
