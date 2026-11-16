export type DiagnosticToken = { content: string; htmlStyle?: Record<string, string> };

// Match the terminal renderer's four-column tab stops, then keep its annotations
// outside the source tokens. Fall back to plain text if the displayed source
// still differs (e.g. Unicode display widths before a tab).
export function alignDiagnosticSource(rendered: string, tokens: DiagnosticToken[]) {
  let column = 0;
  const expanded = tokens.map((token) => ({
    ...token,
    content: Array.from(token.content, (character) => {
      if (character === "\t") {
        const width = 4 - (column % 4);
        column += width;
        return " ".repeat(width);
      }
      column++;
      return character;
    }).join(""),
  }));
  const source = expanded.map((token) => token.content).join("");
  if (!rendered.endsWith(source)) return undefined;
  return { gutter: rendered.slice(0, rendered.length - source.length), tokens: expanded };
}
