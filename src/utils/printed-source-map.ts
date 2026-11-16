import { traceSegment, TraceMap } from "@jridgewell/trace-mapping";
import type { IPosition, IRange } from "monaco-editor";

const identifier = /^[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*/u;

// Resolve only explicit token mappings. A greatest-lower-bound lookup could
// carry the previous token's origin into synthetic helpers or unmapped text.
export function createPrintedSourceMapper(sourceMap: string, source: string) {
  try {
    const map = new TraceMap(sourceMap);
    if (
      map.sources.length !== 1 ||
      (map.sourcesContent?.[0] != null && map.sourcesContent[0] !== source)
    ) {
      return () => undefined;
    }
    const lines = source.split(/\r\n|\r|\n/);
    return (position: IPosition): IRange | undefined => {
      const segment = traceSegment(map, position.lineNumber - 1, position.column - 1);
      if (
        !segment ||
        segment[0] !== position.column - 1 ||
        segment.length === 1 ||
        segment[1] !== 0
      )
        return;
      const [, , line, column] = segment;
      const text = lines[line];
      if (text == null || column > text.length) return;
      const word = identifier.exec(text.slice(column))?.[0];
      // Monaco excludes a leading BOM from its first line's coordinates.
      const bom = line === 0 && text.charCodeAt(0) === 0xfeff ? 1 : 0;
      const startColumn = Math.max(1, column + 1 - bom);
      return {
        startLineNumber: line + 1,
        startColumn,
        endLineNumber: line + 1,
        endColumn: startColumn + (word?.length ?? 0),
      };
    };
  } catch {
    // Empty, stale, or invalid maps must never send the user to a guessed origin.
    return () => undefined;
  }
}
