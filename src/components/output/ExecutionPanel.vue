<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, nextTick, onBeforeUnmount, ref, useId, useTemplateRef, watch } from "vue";
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
const srcdoc = ref("");
const runId = ref(0);
const topLevelComplete = ref(false);
const pendingTimers = ref(0);
const sandbox = useTemplateRef<HTMLIFrameElement>("sandbox");
const consoleEl = useTemplateRef<HTMLDivElement>("consoleEl");
const tipId = useId();
const consoleId = useId();
// Once there is a run to repeat, "Rerun" says so without changing the action.
const runLabel = computed(() => (status.value === "idle" ? "Run output" : "Rerun"));
const disabledReason = computed(() => getRunDisabledReason(props.code, props.sourceType));
const stoppable = computed(
  () => !!srcdoc.value && (status.value === "running" || pendingTimers.value > 0),
);
const tip = computed(
  () =>
    disabledReason.value ??
    (props.disabled
      ? "Run output is unavailable while Oxc reports an error or Isolated Declarations is enabled."
      : undefined),
);

// "Finished" means the synchronous code and every timer it scheduled are done.
// Pending timers keep the run in the running state.
function syncStatus() {
  if (status.value === "error" || status.value === "stopped" || status.value === "idle") return;
  status.value = topLevelComplete.value && pendingTimers.value === 0 ? "complete" : "running";
}

function append(text: string, level: string) {
  // Follow new output unless the user scrolled up to read earlier messages.
  const consoleNode = consoleEl.value;
  const atBottom =
    !consoleNode ||
    consoleNode.scrollHeight - consoleNode.scrollTop - consoleNode.clientHeight < 24;
  entries.value.push({ text, level });
  if (entries.value.length > 500) entries.value.shift();
  if (expanded.value && atBottom) {
    void nextTick(() => {
      if (consoleEl.value) consoleEl.value.scrollTop = consoleEl.value.scrollHeight;
    });
  }
}

function stop() {
  srcdoc.value = "";
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
    srcdoc.value = createRunnerDocument(props.code, props.sourceType, props.sourceMap);
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
</script>

<template>
  <section class="shrink-0 border-t" aria-label="Output execution">
    <div class="flex items-center gap-2 px-2 py-1.5">
      <Button
        size="sm"
        variant="outline"
        :disabled="!code || !!tip"
        :aria-describedby="tip ? tipId : undefined"
        @click="run"
      >
        <Icon icon="ri:play-line" />
        {{ runLabel }}
      </Button>
      <Button v-if="stoppable" size="sm" variant="ghost" @click="stop"> Stop </Button>
      <span
        v-if="expanded || status !== 'idle'"
        class="text-xs text-muted-foreground"
        role="status"
      >
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
      <div v-if="expanded || status !== 'idle'" class="ml-auto flex items-center gap-1">
        <Button v-if="expanded" size="sm" variant="ghost" @click="entries = []"
          >Clear console</Button
        >
        <Button
          size="icon"
          variant="ghost"
          class="h-7 w-7"
          :aria-label="expanded ? 'Collapse console' : 'Expand console'"
          :title="expanded ? 'Collapse console' : 'Expand console'"
          :aria-expanded="expanded"
          :aria-controls="consoleId"
          @click="expanded = !expanded"
        >
          <Icon :icon="expanded ? 'ri:arrow-down-s-line' : 'ri:arrow-up-s-line'" />
        </Button>
      </div>
    </div>
    <p v-if="tip" :id="tipId" class="px-3 pb-2 text-xs text-muted-foreground">
      {{ tip }}
    </p>
    <div
      v-show="expanded"
      :id="consoleId"
      ref="consoleEl"
      class="max-h-[50vh] min-h-16 resize-y overflow-auto border-t px-3 py-2 text-xs font-mono"
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
      v-if="srcdoc"
      :key="runId"
      ref="sandbox"
      :srcdoc="srcdoc"
      sandbox="allow-scripts"
      title="Output execution sandbox"
      class="hidden"
    />
  </section>
</template>
