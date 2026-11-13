import { useEventListener } from "@vueuse/core";
import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";
import { createRunnerDocument } from "~/utils/output-runner";

export type SandboxStatus = "idle" | "running" | "complete" | "error" | "stopped";
export type SandboxEntry = { text: string; level: string };

export function useSandboxRun(frame: MaybeRefOrGetter<HTMLIFrameElement | null | undefined>) {
  const status = ref<SandboxStatus>("idle");
  const entries = ref<SandboxEntry[]>([]);
  const srcdoc = ref("");
  const runId = ref(0);
  const pendingTimers = ref(0);
  const stoppable = computed(
    () => !!srcdoc.value && (status.value === "running" || pendingTimers.value > 0),
  );

  function append(text: string, level: string) {
    entries.value.push({ text, level });
    if (entries.value.length > 500) entries.value.shift();
  }

  function fail(error: unknown) {
    append(error instanceof Error ? error.message : String(error), "error");
    status.value = "error";
  }

  function stop() {
    srcdoc.value = "";
    if (status.value === "running" || status.value === "complete") status.value = "stopped";
  }

  function reset() {
    stop();
    status.value = "idle";
    entries.value = [];
    pendingTimers.value = 0;
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
        if (data.type === "error") status.value = "error";
        break;
      case "activity":
        if (typeof data.pendingTimers !== "number" || typeof data.topLevelComplete !== "boolean") {
          return;
        }
        pendingTimers.value = Math.max(0, data.pendingTimers);
        if (status.value === "running" || status.value === "complete") {
          status.value =
            data.topLevelComplete && pendingTimers.value === 0 ? "complete" : "running";
        }
        break;
    }
  });

  return { status, entries, srcdoc, runId, stoppable, run, stop, reset, fail };
}
