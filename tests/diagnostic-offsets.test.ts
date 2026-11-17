import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createDiagnosticOffsetMapper,
  createDiagnosticPositionMapper,
} from "../src/utils/diagnostic-offsets.ts";

const bom = String.fromCharCode(0xfeff);

test("diagnostic offsets preserve ASCII, Unicode, CRLF, and EOF positions", () => {
  for (const source of ["", "const unused = 1;\r\n", 'console.log("😀");\r\nconst café = "é𐐀";']) {
    const toUtf16 = createDiagnosticOffsetMapper(source);
    let offset = 0;
    for (const character of source) {
      const bytes = new TextEncoder().encode(source.slice(0, offset)).length;
      assert.equal(toUtf16(bytes), offset);
      offset += character.length;
    }
    assert.equal(toUtf16(new TextEncoder().encode(source).length), source.length);
    assert.equal(toUtf16(Number.MAX_SAFE_INTEGER), source.length);
    assert.equal(toUtf16(-1), 0);
  }
});

test("a diagnostic after an emoji selects the complete Unicode identifier", () => {
  const source = 'console.log("😀");\nconst café = 1;';
  const toUtf16 = createDiagnosticOffsetMapper(source);
  const start = new TextEncoder().encode(source.slice(0, source.indexOf("café"))).length;
  const end = start + new TextEncoder().encode("café").length;
  assert.equal(source.slice(toUtf16(start), toUtf16(end)), "café");
});

test("diagnostic positions survive Monaco's BOM and line-ending normalization", () => {
  for (const source of [
    bom + "const café = 1;",
    "// 😀\r\n// second\nconst café = 1;",
    bom + "// 😀\r// second\r\nconst café = 1;",
  ]) {
    const start = source.indexOf("café");
    const byteStart = new TextEncoder().encode(source.slice(0, start)).length;
    const toPosition = createDiagnosticPositionMapper(source);
    const normalizedPrefix = source
      .slice(source.startsWith(bom) ? 1 : 0, start)
      .split(/\r\n|\r|\n/u);
    assert.deepEqual(toPosition(byteStart), {
      lineNumber: normalizedPrefix.length,
      column: normalizedPrefix.at(-1)!.length + 1,
    });
    assert.deepEqual(toPosition(byteStart + new TextEncoder().encode("café").length), {
      lineNumber: normalizedPrefix.length,
      column: normalizedPrefix.at(-1)!.length + 5,
    });
  }
});

test("diagnostic positions clamp line endings, BOM, empty input, and EOF", () => {
  const toPosition = createDiagnosticPositionMapper(bom + "a\r\nb\rc\n");
  assert.deepEqual(toPosition(0), { lineNumber: 1, column: 1 });
  assert.deepEqual(toPosition(4), { lineNumber: 1, column: 2 });
  assert.deepEqual(toPosition(5), { lineNumber: 1, column: 2 });
  assert.deepEqual(toPosition(6), { lineNumber: 2, column: 1 });
  assert.deepEqual(toPosition(Infinity), { lineNumber: 4, column: 1 });
  assert.deepEqual(createDiagnosticPositionMapper("")(0), { lineNumber: 1, column: 1 });
});
