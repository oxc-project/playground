<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { refDebounced } from "@vueuse/core";
import { computed, nextTick, ref, useId, useTemplateRef, watch } from "vue";
import { useSandboxRun, type SandboxStatus } from "~/composables/sandbox-run";
import { compareEnabled } from "~/composables/state";
import { Button } from "~/ui/button";
import SandboxConsole from "./SandboxConsole.vue";

const props = defineProps<{
  code: string;
  sourceType: string;
  sourceMap?: string;
  baselineCode?: string;
  baselineSourceMap?: string;
  baselineError?: string;
}>();

const expanded = ref(false);
const consoleId = useId();
const outputFrame = useTemplateRef<HTMLIFrameElement>("outputFrame");
const baselineFrame = useTemplateRef<HTMLIFrameElement>("baselineFrame");
const output = useSandboxRun(outputFrame);
const baseline = useSandboxRun(baselineFrame);

const status = computed<SandboxStatus>(() => {
  if (!compareEnabled.value) return output.status.value;
  const statuses = [output.status.value, baseline.status.value];
  if (statuses.includes("running")) return "running";
  if (statuses.includes("error")) return "error";
  if (statuses.includes("stopped")) return "stopped";
  return statuses.every((value) => value === "complete") ? "complete" : "idle";
});

const statuses: Record<SandboxStatus, string> = {
  idle: "Not run",
  running: "",
  complete: "Finished",
  error: "Failed",
  stopped: "Stopped",
};

// Skip transient states during quick runs and reruns.
const visibleStatus = refDebounced(status, 150);
const visibleOutputStatus = refDebounced(output.status, 150);
const visibleBaselineStatus = refDebounced(baseline.status, 150);
const statusText = computed(() =>
  visibleStatus.value === "idle" ? "Output changed — run again" : statuses[visibleStatus.value],
);
const delayedRunId = refDebounced(output.runId, 150);
const running = computed(
  () => status.value === "running" && output.runId.value === delayedRunId.value,
);
// The output action leaves Compare mode and reruns the output alone.
const runLabel = computed(() => {
  if (running.value && !compareEnabled.value) return "Running…";
  return compareEnabled.value || output.status.value === "idle" ? "Run output" : "Rerun";
});
// The comparison action runs both sides and stays active.
const compareLabel = computed(() => {
  if (running.value && compareEnabled.value) return "Comparing…";
  return compareEnabled.value && baseline.status.value !== "idle" ? "Recompare" : "Compare";
});
const stoppable = computed(
  () => output.stoppable.value || (compareEnabled.value && baseline.stoppable.value),
);

function run() {
  expanded.value = true;
  output.run(props.code, props.sourceType, props.sourceMap);
  if (compareEnabled.value) {
    if (props.baselineError) {
      baseline.reset();
      baseline.fail(`Baseline compilation failed: ${props.baselineError}`);
    } else {
      baseline.run(props.baselineCode ?? "", props.sourceType, props.baselineSourceMap);
    }
  }
}

async function runComparison() {
  compareEnabled.value = true;
  // Wait for baseline compilation and the updated props before running.
  await nextTick();
  // The output action may have been chosen before this flush.
  if (compareEnabled.value) run();
}

function runOutput() {
  if (compareEnabled.value) {
    compareEnabled.value = false;
    baseline.reset();
  }
  run();
}

function stop() {
  output.stop();
  baseline.stop();
}

function clear() {
  output.clear();
  baseline.clear();
}

watch([() => props.code, () => props.sourceType, () => props.sourceMap], () => {
  output.reset();
  baseline.reset();
});
// The baseline changes on its own when the source or parser changes, and when
// Compare is enabled; only the baseline run is stale then.
watch([() => props.baselineCode, () => props.baselineSourceMap, () => props.baselineError], () =>
  baseline.reset(),
);
</script>

<template>
  <section class="shrink-0 border-t" aria-label="Output execution">
    <div class="flex flex-wrap items-center gap-2 px-2 py-1.5">
      <Button
        size="sm"
        variant="outline"
        class="active:translate-y-px"
        :aria-busy="!compareEnabled && status === 'running'"
        @click="runOutput"
      >
        <Icon
          :icon="running && !compareEnabled ? 'ri:loader-2-line' : 'ri:play-line'"
          :class="{ 'animate-spin': running && !compareEnabled }"
        />
        {{ runLabel }}
      </Button>
      <Button
        size="sm"
        :variant="compareEnabled ? 'secondary' : 'ghost'"
        class="active:translate-y-px"
        :aria-pressed="compareEnabled"
        :aria-busy="compareEnabled && status === 'running'"
        @click="runComparison"
      >
        <Icon
          :icon="running && compareEnabled ? 'ri:loader-2-line' : 'ri:split-cells-horizontal'"
          :class="{ 'animate-spin': running && compareEnabled }"
        />
        {{ compareLabel }}
      </Button>
      <Button
        v-if="stoppable && output.runId.value === delayedRunId"
        size="sm"
        variant="ghost"
        @click="stop"
      >
        Stop
      </Button>
      <span
        v-if="expanded || status !== 'idle'"
        class="text-xs text-muted-foreground"
        role="status"
      >
        {{ statusText }}
      </span>
      <div v-if="expanded || status !== 'idle'" class="ml-auto flex items-center gap-1">
        <Button
          v-if="expanded"
          size="icon"
          variant="ghost"
          class="h-7 w-7"
          aria-label="Clear console"
          title="Clear console"
          @click="clear"
        >
          <Icon icon="ri:delete-bin-line" />
        </Button>
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
    <div
      v-show="expanded"
      :id="consoleId"
      class="border-t"
      :class="{ 'grid grid-cols-1 md:grid-cols-2 md:divide-x': compareEnabled }"
    >
      <section v-if="compareEnabled" aria-label="Baseline execution">
        <p class="grid grid-cols-[1fr_auto] gap-x-2 px-3 pt-2 text-xs">
          <span class="font-medium">Baseline</span>
          <span class="text-muted-foreground">{{ statuses[visibleBaselineStatus] }}</span>
          <span class="col-span-2 text-muted-foreground">esnext, no minification</span>
        </p>
        <SandboxConsole :entries="baseline.entries.value" label="Baseline console" />
      </section>
      <section :aria-label="compareEnabled ? 'Current options execution' : undefined">
        <p v-if="compareEnabled" class="grid grid-cols-[1fr_auto] gap-x-2 px-3 pt-2 text-xs">
          <span class="font-medium">Output</span>
          <span class="text-muted-foreground">{{ statuses[visibleOutputStatus] }}</span>
          <span class="col-span-2 text-muted-foreground">current options</span>
        </p>
        <SandboxConsole :entries="output.entries.value" label="Execution console" />
      </section>
    </div>
    <iframe
      v-if="output.srcdoc.value"
      :key="`output-${output.runId.value}`"
      ref="outputFrame"
      :srcdoc="output.srcdoc.value"
      sandbox="allow-scripts"
      title="Output execution sandbox"
      class="hidden"
    />
    <iframe
      v-if="compareEnabled && baseline.srcdoc.value"
      :key="`baseline-${baseline.runId.value}`"
      ref="baselineFrame"
      :srcdoc="baseline.srcdoc.value"
      sandbox="allow-scripts"
      title="Baseline execution sandbox"
      class="hidden"
    />
  </section>
</template>
