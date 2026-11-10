// This source is embedded in a sandboxed iframe, not executed in the playground.
const payload = JSON.parse(document.getElementById("runner-payload").textContent);
const send = parent.postMessage.bind(parent);
const serialize = JSON.stringify.bind(JSON);
const stringify = (value) => {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.stack || value.message;
  if (typeof value === "function" || typeof value === "symbol") return String(value);
  const seen = new WeakSet();
  try {
    return (
      serialize(value, (_key, entry) => {
        if (typeof entry === "bigint") return `${entry}n`;
        if (entry !== null && typeof entry === "object") {
          if (seen.has(entry)) return "[Circular]";
          seen.add(entry);
        }
        return entry;
      }) ?? String(value)
    );
  } catch {
    return "[Unserializable value]";
  }
};
const report = (type, text = "", level = "log") => {
  send({ channel: "oxc-output-runner", type, text: text.slice(0, 10000), level }, "*");
};
const reportError = (error) => report("error", stringify(error), "error");

for (const level of ["log", "info", "warn", "error", "debug", "dir", "table"]) {
  console[level] = (...args) => report("console", args.map(stringify).join(" "), level);
}
console.assert = (condition, ...args) => {
  if (!condition) report("console", `Assertion failed: ${args.map(stringify).join(" ")}`, "error");
};
console.clear = () => report("clear");
addEventListener("error", (event) => {
  event.preventDefault();
  reportError(event.error || event.message);
});
addEventListener("unhandledrejection", (event) => {
  event.preventDefault();
  reportError(event.reason);
});

// Pending timers keep the run "Running" after synchronous evaluation ends.
// Promise-based work cannot be tracked without a runtime hook, so it is not counted.
let pendingTimers = 0;
let topLevelComplete = false;
const reportState = () =>
  send({ channel: "oxc-output-runner", type: "activity", pendingTimers, topLevelComplete }, "*");
const nativeSetTimeout = globalThis.setTimeout.bind(globalThis);
const nativeSetInterval = globalThis.setInterval.bind(globalThis);
const nativeClearTimeout = globalThis.clearTimeout.bind(globalThis);
const nativeClearInterval = globalThis.clearInterval.bind(globalThis);
const activeTimers = new Set();
const timerGlobal = globalThis;
const apply = Reflect.apply;
// oxlint-disable-next-line no-eval -- Preserve native string timer semantics inside the sandbox.
const indirectEval = globalThis.eval;

function trackTimer(nativeSet, repeating) {
  return function (callback, delay, ...args) {
    // Preserve the native error for a missing required handler. Convert string
    // handlers at scheduling time, then evaluate them in the global scope.
    if (arguments.length === 0) return nativeSet();
    const handler = typeof callback === "function" ? callback : `${callback}`;
    const id = nativeSet(() => {
      if (!repeating) activeTimers.delete(id);
      try {
        if (typeof handler === "function") apply(handler, timerGlobal, args);
        else indirectEval(handler);
      } finally {
        pendingTimers = activeTimers.size;
        reportState();
      }
    }, delay);
    activeTimers.add(id);
    pendingTimers = activeTimers.size;
    reportState();
    return id;
  };
}

globalThis.setTimeout = trackTimer(nativeSetTimeout, false);
globalThis.setInterval = trackTimer(nativeSetInterval, true);
const clearTimer = (nativeClear) => (id) => {
  nativeClear(id);
  activeTimers.delete(id);
  pendingTimers = activeTimers.size;
  reportState();
};
globalThis.clearTimeout = clearTimer(nativeClearTimeout);
globalThis.clearInterval = clearTimer(nativeClearInterval);

try {
  // A separate script element preserves script scope and top-level `this`.
  // The bootstrap itself is a module so its bindings cannot collide with user code.
  if (payload.sourceType === "script") {
    const script = document.createElement("script");
    script.textContent = payload.code;
    document.body.append(script);
  } else {
    const url = URL.createObjectURL(new Blob([payload.code], { type: "text/javascript" }));
    try {
      await import(url);
    } catch (error) {
      throw new Error(
        `Module execution failed (only Oxc runtime imports are supported): ${stringify(error)}`,
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  topLevelComplete = true;
  reportState();
  report("complete");
} catch (error) {
  reportError(error);
}
