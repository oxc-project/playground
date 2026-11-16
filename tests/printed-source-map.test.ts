import assert from "node:assert/strict";
import { test } from "node:test";
import { createPrintedSourceMapper } from "../src/utils/printed-source-map.ts";

function mapper(source: string, mappings: number[][][]) {
  return createPrintedSourceMapper(
    JSON.stringify({
      version: 3,
      sources: ["test.tsx"],
      sourcesContent: [source],
      names: [],
      mappings,
    }),
    source,
  );
}

test("origin mapping uses exact tokens and preserves unmapped helper boundaries", () => {
  const resolve = mapper("const original = 1;", [[[0, 0, 0, 6], [1], [10, 0, 0, 17]]]);
  assert.deepEqual(resolve({ lineNumber: 1, column: 1 }), {
    startLineNumber: 1,
    startColumn: 7,
    endLineNumber: 1,
    endColumn: 15,
  });
  assert.equal(resolve({ lineNumber: 1, column: 2 }), undefined);
  assert.equal(resolve({ lineNumber: 1, column: 5 }), undefined);
  assert.equal(resolve({ lineNumber: 2, column: 1 }), undefined);
});

test("source map coordinates select Unicode identifiers after emoji and CRLF", () => {
  const source = '// 😀\r\nconst café = "😀"; const 𐐀value = café;';
  const resolve = mapper(source, [
    [
      [0, 0, 1, 6],
      [4, 0, 1, 25],
    ],
  ]);
  assert.deepEqual(resolve({ lineNumber: 1, column: 1 }), {
    startLineNumber: 2,
    startColumn: 7,
    endLineNumber: 2,
    endColumn: 11,
  });
  const result = resolve({ lineNumber: 1, column: 5 })!;
  assert.equal(
    source.split("\r\n")[1]!.slice(result.startColumn - 1, result.endColumn - 1),
    "𐐀value",
  );
});

test("invalid, stale, and multi-source maps cannot navigate", () => {
  for (const sourceMap of [
    "",
    "not a map",
    JSON.stringify({ version: 3, sources: ["a"], sourcesContent: ["stale"], mappings: "AAAA" }),
    JSON.stringify({ version: 3, sources: ["a", "b"], mappings: "AAAA" }),
  ]) {
    assert.equal(
      createPrintedSourceMapper(sourceMap, "const x = 1;")({ lineNumber: 1, column: 1 }),
      undefined,
    );
  }
});

test("a leading BOM maps into Monaco's editable coordinates", () => {
  const resolve = mapper("﻿const café = 1;", [[[0, 0, 0, 7]]]);
  assert.equal(resolve({ lineNumber: 1, column: 1 })?.startColumn, 7);
});
