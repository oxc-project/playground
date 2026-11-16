import assert from "node:assert/strict";
import { test } from "node:test";
import { createSourceRangeMapper } from "../src/utils/source-range.ts";

const byteLength = (value: string) => new TextEncoder().encode(value).length;

test("ESTree UTF-16 and symbol UTF-8 spans select the same Unicode source", () => {
  for (const source of [
    'const emoji = "😀"; const café = 1;',
    '// 😀\r\nfunction outer() {\r\n  const 𐐀value = "é";\r\n}',
    "﻿// 😀\rconst café = 1;",
  ]) {
    const name = source.includes("𐐀value") ? "𐐀value" : "café";
    const start = source.indexOf(name);
    const end = start + name.length;
    const treeRange = createSourceRangeMapper(source, "utf16")({ start, end });
    const symbolRange = createSourceRangeMapper(
      source,
      "utf8",
    )({
      start: byteLength(source.slice(0, start)),
      end: byteLength(source.slice(0, end)),
    });
    assert.deepEqual(symbolRange, treeRange);
    assert.equal(source.slice(...treeRange!.offsets), name);
    const lines = source.slice(source.startsWith("﻿") ? 1 : 0, start).split(/\r\n|\r|\n/);
    assert.deepEqual(treeRange!.positions, {
      startLineNumber: lines.length,
      startColumn: lines.at(-1)!.length + 1,
      endLineNumber: lines.length,
      endColumn: lines.at(-1)!.length + name.length + 1,
    });
  }
});

test("missing, synthetic, malformed and out-of-source spans have no action", () => {
  for (const encoding of ["utf8", "utf16"] as const) {
    const map = createSourceRangeMapper("abc", encoding);
    for (const span of [
      null,
      undefined,
      {},
      { start: 0 },
      { start: "0", end: 1 },
      { start: 0, end: 0 },
      { start: 2, end: 1 },
      { start: -1, end: 1 },
      { start: 0.5, end: 2 },
      { start: 0, end: 4 },
      { start: NaN, end: 1 },
      { start: 0, end: Infinity },
    ])
      assert.equal(map(span), undefined);
    assert.ok(map({ start: 0, end: 3 }));
  }
});

test("navigation rejects offsets inside Unicode characters", () => {
  const bytes = createSourceRangeMapper("a😀éz", "utf8");
  for (const span of [
    { start: 2, end: 5 },
    { start: 1, end: 4 },
    { start: 5, end: 6 },
  ]) {
    assert.equal(bytes(span), undefined);
  }
  assert.deepEqual(bytes({ start: 1, end: 7 })!.offsets, [1, 4]);
  const units = createSourceRangeMapper("a😀éz", "utf16");
  assert.equal(units({ start: 2, end: 3 }), undefined);
  assert.equal(units({ start: 1, end: 2 }), undefined);
});

test("rebuilding after edits uses current positions and bounds", () => {
  const before = createSourceRangeMapper("const café = 1;", "utf8");
  const after = createSourceRangeMapper("// 😀\nconst café = 1;", "utf8");
  assert.equal(before({ start: 6, end: 11 })!.positions.startLineNumber, 1);
  assert.equal(after({ start: 14, end: 19 })!.positions.startLineNumber, 2);
  assert.equal(createSourceRangeMapper("x", "utf8")({ start: 6, end: 11 }), undefined);
});
