// This source is embedded in a sandboxed iframe, not executed in the playground.
const payload = JSON.parse(document.getElementById("runner-payload").textContent);
const send = parent.postMessage.bind(parent);
const stringify = (value) => {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.stack || value.message;
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    // Circular structures and BigInt values are not serializable.
    return String(value);
  }
};
const report = (type, text = "", level = "log") => {
  send({ channel: "oxc-output-runner", type, text: text.slice(0, 10000), level }, "*");
};
const reportError = (error) => report("error", stringify(error), "error");

for (const level of ["log", "info", "warn", "error"]) {
  console[level] = (...args) => report("console", args.map(stringify).join(" "), level);
}
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
const activeTimers = new Set();
const nativeSetTimeout = globalThis.setTimeout.bind(globalThis);
const nativeSetInterval = globalThis.setInterval.bind(globalThis);
const nativeClearTimeout = globalThis.clearTimeout.bind(globalThis);
const nativeClearInterval = globalThis.clearInterval.bind(globalThis);

function trackTimer(nativeSet, repeating) {
  return function (callback, delay, ...args) {
    // Let the native timer report the missing required handler.
    if (arguments.length === 0) return nativeSet();
    const id = nativeSet(() => {
      if (!repeating) activeTimers.delete(id);
      try {
        Reflect.apply(callback, globalThis, args);
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

function clearTimer(nativeClear) {
  return (id) => {
    nativeClear(id);
    activeTimers.delete(id);
    pendingTimers = activeTimers.size;
    reportState();
  };
}

globalThis.setTimeout = trackTimer(nativeSetTimeout, false);
globalThis.setInterval = trackTimer(nativeSetInterval, true);
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
      throw new Error(`Module execution failed: ${stringify(error)}`);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  topLevelComplete = true;
  reportState();
} catch (error) {
  reportError(error);
}
