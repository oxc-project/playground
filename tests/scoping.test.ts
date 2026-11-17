import assert from "node:assert/strict";
import test from "node:test";
import { createSemanticSource, parseScoping } from "../src/utils/scoping.ts";

test("semantic byte spans map Unicode, CRLF and BOM into Monaco positions", () => {
  const source = "﻿// 😀\r\nconst café = 1;\r\n𐐀value += café;";
  const bytes = new TextEncoder();
  const mapper = createSemanticSource(source);
  for (const name of ["café", "𐐀value"]) {
    const offset = source.indexOf(name);
    const start = bytes.encode(source.slice(0, offset)).length;
    const location = mapper.locate({ start, end: start + bytes.encode(name).length });
    assert.equal(location?.text, name);
    assert.deepEqual(
      location?.range,
      name === "café"
        ? { startLineNumber: 2, startColumn: 7, endLineNumber: 2, endColumn: 11 }
        : { startLineNumber: 3, startColumn: 1, endLineNumber: 3, endColumn: 8 },
    );
    const normalized = source.replace(/^﻿/, "").replace(/\r\n|\r/g, "\n");
    const line = normalized.split("\n")[location!.range.startLineNumber - 1]!;
    assert.equal(line.slice(location!.range.startColumn - 1, location!.range.endColumn - 1), name);
  }
  const start = bytes.encode(source.slice(0, source.lastIndexOf("café"))).length;
  assert.equal(mapper.locate({ start, end: start + 5 })?.snippet, "𐐀value += café;");
});

test("semantic source rejects partial UTF-8 characters and invalid spans", () => {
  const mapper = createSemanticSource("😀café");
  for (const span of [
    { start: 1, end: 4 },
    { start: 0, end: 2 },
    { start: -1, end: 4 },
    { start: 0, end: 99 },
    { start: 4.5, end: 5 },
    { start: 5, end: 4 },
    { start: 4, end: 4 },
  ]) {
    assert.equal(mapper.locate(span), undefined);
  }
  assert.equal(mapper.locate({ start: 0, end: 4 })?.text, "😀");
});

test("legacy and unknown semantic formats cannot be misread as the new snapshot", () => {
  assert.equal(parseScoping(undefined), undefined);
  assert.throws(() => parseScoping("[]"), /Unsupported scoping data/);
  assert.throws(
    () =>
      parseScoping(
        '{"version":2,"offsetEncoding":"utf8","scopes":[],"symbols":[],"references":[]}',
      ),
    /Unsupported scoping data/,
  );
});
