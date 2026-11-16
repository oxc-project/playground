import assert from "node:assert/strict";
import { test } from "node:test";
import { createDiagnosticOffsetMapper } from "../src/utils/diagnostic-offsets.ts";

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
