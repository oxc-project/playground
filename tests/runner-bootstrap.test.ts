import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createContext, runInContext } from "node:vm";

const bootstrap = readFileSync(
  new URL("../src/utils/runner-bootstrap.js", import.meta.url),
  "utf8",
);

// Exercise the actual iframe bootstrap with browser-shaped timers and script scope.
async function sandbox(code: string) {
  const messages: {
    type: string;
    text: string;
    pendingTimers: number;
    topLevelComplete: boolean;
  }[] = [];
  const timers = new Map<number, { callback: () => void; repeating: boolean }>();
  let nextId = 1;
  const schedule = (repeating: boolean) =>
    function (callback: () => void) {
      if (arguments.length === 0) throw new TypeError("Missing handler");
      const id = nextId++;
      timers.set(id, { callback, repeating });
      return id;
    };
  const clear = (id: number) => {
    timers.delete(+id | 0);
  };
  const context = createContext({
    console: {},
    parent: { postMessage: (message: (typeof messages)[number]) => messages.push(message) },
    addEventListener: () => {},
    setTimeout: schedule(false),
    setInterval: schedule(true),
    clearTimeout: clear,
    clearInterval: clear,
    document: {
      getElementById: () => ({ textContent: JSON.stringify({ code, sourceType: "script" }) }),
      createElement: () => ({ textContent: "" }),
      body: {
        append: (script: { textContent: string }) => runInContext(script.textContent, context),
      },
    },
  });
  await runInContext(`(async () => { "use strict";\n${bootstrap}\n})()`, context);
  return {
    messages,
    timers,
    tick() {
      for (const [id, timer] of new Map(timers)) {
        if (!timer.repeating) timers.delete(id);
        timer.callback();
      }
    },
  };
}

test("string timeout handlers execute in global scope and complete", async () => {
  const run = await sandbox(
    `var answer = 42; setTimeout("console.log(answer, typeof payload)", 0);`,
  );
  assert.equal(run.messages.at(-1)?.pendingTimers, 1);
  run.tick();
  assert.equal(run.messages.find((message) => message.type === "console")?.text, "42 undefined");
  assert.equal(run.messages.at(-1)?.pendingTimers, 0);
  assert.equal(run.messages.at(-1)?.topLevelComplete, true);
});

test("non-function handlers are coerced once at scheduling time", async () => {
  const run = await sandbox(`
    var text = "console.log('original')";
    var conversions = 0;
    setTimeout({ toString() { conversions++; return text; } }, 0);
    text = "console.log('changed')";
    console.log(conversions);
  `);
  run.tick();
  assert.deepEqual(
    run.messages.filter((message) => message.type === "console").map((message) => message.text),
    ["1", "original"],
  );
});

test("function timers retain their arguments and browser global receiver", async () => {
  const run = await sandbox(
    `setTimeout(function (a, b) { console.log(this === globalThis, a, b); }, 0, "a", 7);`,
  );
  run.tick();
  assert.equal(run.messages.find((message) => message.type === "console")?.text, "true a 7");
});

test("coercible and cross-API timer IDs cancel both native and tracked work", async () => {
  for (const clear of ["clearTimeout", "clearInterval"]) {
    const run = await sandbox(`
      var id = setInterval("console.log('unexpected')", 0);
      var conversions = 0;
      ${clear}({ valueOf() { conversions++; return String(id); } });
      console.log(conversions);
    `);
    assert.equal(run.timers.size, 0);
    assert.equal(run.messages.at(-1)?.pendingTimers, 0);
    assert.equal(run.messages.at(-1)?.topLevelComplete, true);
    assert.equal(run.messages.find((message) => message.type === "console")?.text, "1");
  }
});

test("timer wrappers retain native missing-handler and invalid-ID errors", async () => {
  const run = await sandbox(`
    for (const schedule of [setTimeout, setInterval]) {
      try { schedule(); } catch (error) { console.log(error.name); }
      try { schedule(Symbol('handler')); } catch (error) { console.log(error.name); }
    }
    for (const id of [1n, Symbol('id')]) {
      try { clearTimeout(id); } catch (error) { console.log(error.name); }
    }
  `);
  assert.equal(run.timers.size, 0);
  assert.deepEqual(
    run.messages.filter((message) => message.type === "console").map((message) => message.text),
    Array(6).fill("TypeError"),
  );
});
