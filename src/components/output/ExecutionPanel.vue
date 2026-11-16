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
  expectedCode?: string;
  expectedComparison?: boolean;
  compilationError?: string;
}>();

const expanded = ref(false);
const expectedComparisonActive = ref(false);
const comparing = computed(() => compareEnabled.value || expectedComparisonActive.value);
const consoleId = useId();
const outputFrame = useTemplateRef<HTMLIFrameElement>("outputFrame");
const baselineFrame = useTemplateRef<HTMLIFrameElement>("baselineFrame");
const expectedFrame = useTemplateRef<HTMLIFrameElement>("expectedFrame");
const output = useSandboxRun(outputFrame);
const baseline = useSandboxRun(baselineFrame);
const expected = useSandboxRun(expectedFrame);
const comparison = computed(() => (expectedComparisonActive.value ? expected : baseline));

const status = computed<SandboxStatus>(() => {
  if (!comparing.value) return output.status.value;
  const statuses = [output.status.value, comparison.value.status.value];
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
const visibleComparisonStatus = refDebounced(
  computed(() => comparison.value.status.value),
  150,
);
const statusText = computed(() =>
  visibleStatus.value === "idle" ? "Output changed — run again" : statuses[visibleStatus.value],
);
const delayedRunId = refDebounced(output.runId, 150);
const running = computed(
  () => status.value === "running" && output.runId.value === delayedRunId.value,
);
// The output action leaves either comparison mode and reruns the output alone.
const runLabel = computed(() => {
  if (running.value && !comparing.value) return "Running…";
  return comparing.value || output.status.value === "idle" ? "Run output" : "Rerun";
});
// One comparison action follows the visible output view.
const comparisonActive = computed(() =>
  props.expectedComparison ? expectedComparisonActive.value : compareEnabled.value,
);
const comparisonRunning = computed(() => comparisonActive.value && running.value);
const compareLabel = computed(() => {
  const target = props.expectedComparison ? "expected" : "baseline";
  if (comparisonRunning.value) return `Comparing ${target}…`;
  return comparisonActive.value && comparison.value.status.value !== "idle"
    ? `Recompare ${target}`
    : `Compare ${target}`;
});
const stoppable = computed(
  () => output.stoppable.value || (comparing.value && comparison.value.stoppable.value),
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
  expected.reset();
  expectedComparisonActive.value = false;
  compareEnabled.value = true;
  // Wait for baseline compilation and the updated props before running.
  await nextTick();
  // Another execution action may have been chosen before this flush.
  if (compareEnabled.value) run();
}

function runExpectedComparison() {
  // Undefined is unset; an empty expectation is valid executable JavaScript.
  if (props.expectedCode === undefined || props.compilationError) return;
  if (compareEnabled.value) {
    compareEnabled.value = false;
    baseline.reset();
  }
  expectedComparisonActive.value = true;
  expanded.value = true;
  output.run(props.code, props.sourceType, props.sourceMap);
  expected.run(props.expectedCode, props.sourceType);
}

function runOutput() {
  if (compareEnabled.value) {
    compareEnabled.value = false;
    baseline.reset();
  }
  expectedComparisonActive.value = false;
  expected.reset();
  run();
}

function stop() {
  output.stop();
  baseline.stop();
  expected.stop();
}

function clear() {
  output.clear();
  baseline.clear();
  expected.clear();
}

watch([() => props.code, () => props.sourceType, () => props.sourceMap], () => {
  output.reset();
  baseline.reset();
  expected.reset();
});
// Expected edits invalidate only the Expected-versus-Current run.
watch([() => props.expectedCode, () => props.compilationError], () => {
  if (!expectedComparisonActive.value) return;
  output.reset();
  expected.reset();
});
// The baseline changes on its own when the source or parser changes, and when
// Compare is enabled; only the baseline run is stale then.
watch([() => props.baselineCode, () => props.baselineSourceMap, () => props.baselineError], () =>
  baseline.reset(),
);
</script>

<template>
  <section class="h-full min-h-0 flex flex-col" aria-label="Output execution">
    <div
      class="flex min-h-11 shrink-0 flex-wrap items-center gap-1 border-b border-border px-3 py-1.5"
      role="group"
      aria-label="Output actions"
    >
      <Button
        size="sm"
        variant="outline"
        class="active:translate-y-px"
        :aria-busy="!comparing && status === 'running'"
        @click="runOutput"
      >
        <Icon
          :icon="running && !comparing ? 'ri:loader-2-line' : 'ri:play-line'"
          :class="{ 'animate-spin': running && !comparing }"
        />
        {{ runLabel }}
      </Button>
      <Button
        size="sm"
        :variant="comparisonActive ? 'secondary' : 'ghost'"
        class="active:translate-y-px"
        :aria-pressed="comparisonActive"
        :aria-busy="comparisonRunning"
        :disabled="expectedComparison && (expectedCode === undefined || !!compilationError)"
        :title="
          expectedComparison
            ? 'Run Expected and Current JavaScript in separate sandboxes'
            : 'Run the esnext baseline (no minification) and Current output'
        "
        @click="expectedComparison ? runExpectedComparison() : runComparison()"
      >
        <Icon
          :icon="comparisonRunning ? 'ri:loader-2-line' : 'ri:split-cells-horizontal'"
          :class="{ 'animate-spin': comparisonRunning }"
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
      <div class="ml-auto flex items-center gap-1">
        <slot name="actions" />
      </div>
    </div>
    <div class="min-h-0 flex-1 overflow-auto" aria-label="Printed output">
      <slot />
    </div>
    <div
      v-if="expanded || status !== 'idle'"
      class="flex shrink-0 items-center gap-2 border-t px-2 py-1.5"
    >
      <span class="text-xs font-medium">Console</span>
      <span class="text-xs text-muted-foreground" role="status">{{ statusText }}</span>
      <div class="ml-auto flex items-center gap-1">
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
      class="shrink-0 border-t"
      :class="{ 'grid grid-cols-1 md:grid-cols-2 md:divide-x': comparing }"
    >
      <section
        v-if="comparing"
        :aria-label="expectedComparisonActive ? 'Expected execution' : 'Baseline execution'"
      >
        <p class="grid grid-cols-[1fr_auto] gap-x-2 px-3 pt-2 text-xs">
          <span class="font-medium">{{ expectedComparisonActive ? "Expected" : "Baseline" }}</span>
          <span class="text-muted-foreground">{{ statuses[visibleComparisonStatus] }}</span>
          <span class="col-span-2 text-muted-foreground">{{
            expectedComparisonActive ? "pasted JavaScript" : "esnext, no minification"
          }}</span>
        </p>
        <SandboxConsole
          :entries="comparison.entries.value"
          :label="expectedComparisonActive ? 'Expected console' : 'Baseline console'"
        />
      </section>
      <section :aria-label="comparing ? 'Current options execution' : undefined">
        <p v-if="comparing" class="grid grid-cols-[1fr_auto] gap-x-2 px-3 pt-2 text-xs">
          <span class="font-medium">{{ expectedComparisonActive ? "Current" : "Output" }}</span>
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
    <iframe
      v-if="expected.srcdoc.value"
      :key="`expected-${expected.runId.value}`"
      ref="expectedFrame"
      :srcdoc="expected.srcdoc.value"
      sandbox="allow-scripts"
      title="Expected execution sandbox"
      class="hidden"
    />
  </section>
</template>
