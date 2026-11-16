import { createDiagnosticOffsetMapper, createUtf16PositionMapper } from "./diagnostic-offsets.ts";

export type SourceOffsetEncoding = "utf8" | "utf16";

// ESTree/comments are serialized as UTF-16; semantic symbol spans retain UTF-8 bytes.
export function createSourceRangeMapper(source: string, encoding: SourceOffsetEncoding) {
  const toUtf16 = encoding === "utf8" ? createDiagnosticOffsetMapper(source) : (n: number) => n;
  const length = encoding === "utf8" ? new TextEncoder().encode(source).length : source.length;
  const toPosition = createUtf16PositionMapper(source);

  function isBoundary(offset: number) {
    if (encoding === "utf8") return offset === 0 || toUtf16(offset - 1) !== toUtf16(offset);
    const before = source.charCodeAt(offset - 1);
    const after = source.charCodeAt(offset);
    return !(before >= 0xd800 && before <= 0xdbff && after >= 0xdc00 && after <= 0xdfff);
  }

  return (span: unknown) => {
    if (!span || typeof span !== "object" || !("start" in span) || !("end" in span)) return;
    const { start, end } = span;
    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start < 0 ||
      end <= start ||
      end > length ||
      !isBoundary(start) ||
      !isBoundary(end)
    )
      return;

    const offsets: [number, number] = [toUtf16(start), toUtf16(end)];
    const startPosition = toPosition(offsets[0]);
    const endPosition = toPosition(offsets[1]);
    return {
      offsets,
      positions: {
        startLineNumber: startPosition.lineNumber,
        startColumn: startPosition.column,
        endLineNumber: endPosition.lineNumber,
        endColumn: endPosition.column,
      },
    };
  };
}
