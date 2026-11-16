import assert from "node:assert/strict";
import { test } from "node:test";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import tsx from "shiki/langs/tsx.mjs";
import { highlightThemes } from "../src/utils/highlight-themes.ts";
import { alignDiagnosticSource } from "../src/utils/diagnostic-codeframe.ts";

test("code-frame excerpts retain block-comment and template-string context", async () => {
  const highlighter = await createHighlighterCore({
    themes: highlightThemes,
    langs: [tsx],
    engine: createJavaScriptRegexEngine(),
  });
  try {
    const source = "/*\ncomment\nreturn true; // TODO\n*/\nconst value = `\nreturn true;\n`;";
    const full = highlighter.codeToTokens(source, {
      lang: "tsx",
      themes: { light: "oxc-light", dark: "oxc-dark" },
    }).tokens;
    for (const lineNumber of [3, 6]) {
      const sourceTokens = full[lineNumber - 1]!;
      const text = sourceTokens.map((token) => token.content).join("");
      const aligned = alignDiagnosticSource(`,-> ${text}`, sourceTokens)!;
      assert.equal(aligned.gutter, ",-> ");
      assert.deepEqual(aligned.tokens, sourceTokens);
      assert.equal(
        aligned.gutter + aligned.tokens.map((token) => token.content).join(""),
        `,-> ${text}`,
      );
      const isolated = highlighter.codeToTokens(text, {
        lang: "tsx",
        themes: { light: "oxc-light", dark: "oxc-dark" },
      }).tokens[0]!;
      assert.notDeepEqual(
        sourceTokens.map((token) => token.htmlStyle),
        isolated.map((token) => token.htmlStyle),
      );
    }
  } finally {
    highlighter.dispose();
  }
});

test("source-token alignment preserves expanded tabs and diagnostic gutters", () => {
  const aligned = alignDiagnosticSource('|     const x = "a    b";', [
    { content: "\tconst", htmlStyle: { color: "red" } },
    { content: ' x = "a\tb";', htmlStyle: { color: "blue" } },
  ])!;
  assert.equal(aligned.gutter, "| ");
  assert.equal(aligned.tokens[0]!.htmlStyle?.color, "red");
  assert.equal(
    aligned.gutter + aligned.tokens.map((token) => token.content).join(""),
    '|     const x = "a    b";',
  );
  assert.equal(alignDiagnosticSource("truncated...", [{ content: "original source" }]), undefined);
});
