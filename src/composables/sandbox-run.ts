import { useEventListener } from "@vueuse/core";
import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";
import { createRunnerDocument } from "~/utils/output-runner";

export type SandboxStatus = "idle" | "running" | "complete" | "error" | "stopped";
export type SandboxEntry = { text: string; level: string };

export function useSandboxRun(frame: MaybeRefOrGetter<HTMLIFrameElement | null | undefined>) {
  const status = ref<SandboxStatus>("idle");
  const entries = ref<SandboxEntry[]>([]);
  // Buffer the current run while the previous result remains visible.
  const runEntries = ref<SandboxEntry[]>([]);
  const srcdoc = ref("");
  const runId = ref(0);
  const pendingTimers = ref(0);
  const stoppable = computed(
    () => !!srcdoc.value && (status.value === "running" || pendingTimers.value > 0),
  );

  function append(text: string, level: string) {
    runEntries.value.push({ text, level });
    if (runEntries.value.length > 500) runEntries.value.shift();
  }

  function fail(error: unknown) {
    append(error instanceof Error ? error.message : String(error), "error");
    entries.value = runEntries.value;
    status.value = "error";
  }

  function stop() {
    if (srcdoc.value) entries.value = runEntries.value;
    srcdoc.value = "";
    if (status.value === "running" || status.value === "complete") status.value = "stopped";
  }

  function reset() {
    srcdoc.value = "";
    status.value = "idle";
    pendingTimers.value = 0;
    runEntries.value = [];
  }

  function clear() {
    entries.value.length = 0;
    runEntries.value.length = 0;
  }

  function run(code: string, sourceType: string, sourceMap?: string) {
    reset();
    status.value = "running";
    runId.value++;
    try {
      srcdoc.value = createRunnerDocument(code, sourceType, sourceMap);
    } catch (error) {
      fail(error);
    }
  }

  useEventListener(window, "message", (event) => {
    const sandbox = toValue(frame);
    if (!sandbox || event.source !== sandbox.contentWindow) return;
    const data = event.data;
    if (!data || data.channel !== "oxc-output-runner") return;
    switch (data.type) {
      case "console":
      case "error":
        if (typeof data.text !== "string" || typeof data.level !== "string") return;
        append(data.text, data.level);
        if (data.type === "error") {
          entries.value = runEntries.value;
          status.value = "error";
        }
        break;
      case "activity":
        if (typeof data.pendingTimers !== "number" || typeof data.topLevelComplete !== "boolean") {
          return;
        }
        pendingTimers.value = Math.max(0, data.pendingTimers);
        if (status.value === "running" || status.value === "complete") {
          status.value =
            data.topLevelComplete && pendingTimers.value === 0 ? "complete" : "running";
          if (status.value === "complete") entries.value = runEntries.value;
        }
        break;
    }
  });

  return { status, entries, srcdoc, runId, stoppable, run, stop, reset, clear, fail };
}
