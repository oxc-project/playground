// Map into line/column coordinates, which survive Monaco's newline
// normalization. Monaco also keeps a leading BOM outside its editable text.
export function createDiagnosticPositionMapper(
  source: string,
  toUtf16 = createDiagnosticOffsetMapper(source),
) {
  const starts = [source.charCodeAt(0) === 0xfeff ? 1 : 0];
  const ends: number[] = [];
  for (const match of source.matchAll(/\r\n|\r|\n/g)) {
    ends.push(match.index);
    starts.push(match.index + match[0].length);
  }
  ends.push(source.length);

  return (byteOffset: number) => {
    const offset = toUtf16(byteOffset);
    let low = 0;
    let high = starts.length;
    while (low < high) {
      const middle = (low + high) >>> 1;
      if (starts[middle]! <= offset) low = middle + 1;
      else high = middle;
    }
    const line = Math.max(0, low - 1);
    return {
      lineNumber: line + 1,
      column: Math.max(1, Math.min(offset, ends[line]!) - starts[line]! + 1),
    };
  };
}

// Diagnostic labels use UTF-8 byte offsets; Monaco models use UTF-16 offsets.
// Store only multibyte characters so ASCII input needs no lookup table.
export function createDiagnosticOffsetMapper(source: string) {
  const adjustments: { start: number; end: number; utf16Start: number; difference: number }[] = [];
  let bytes = 0;
  let utf16 = 0;
  for (const character of source) {
    const codePoint = character.codePointAt(0)!;
    const size = codePoint <= 0x7f ? 1 : codePoint <= 0x7ff ? 2 : codePoint <= 0xffff ? 3 : 4;
    if (size !== character.length) {
      adjustments.push({
        start: bytes,
        end: bytes + size,
        utf16Start: utf16,
        difference: bytes + size - utf16 - character.length,
      });
    }
    bytes += size;
    utf16 += character.length;
  }

  function findAdjustment(offset: number) {
    let low = 0;
    let high = adjustments.length;
    while (low < high) {
      const middle = (low + high) >>> 1;
      if (adjustments[middle]!.end <= offset) low = middle + 1;
      else high = middle;
    }
    return low;
  }

  const toUtf16 = (byteOffset: number) => {
    const offset = Math.max(0, Math.min(byteOffset, bytes));
    const index = findAdjustment(offset);
    const next = adjustments[index];
    // A byte inside a multibyte character belongs to that character's start.
    if (next && offset >= next.start) return next.utf16Start;
    return offset - (adjustments[index - 1]?.difference ?? 0);
  };
  return Object.assign(toUtf16, {
    isBoundary(byteOffset: number) {
      if (!Number.isInteger(byteOffset) || byteOffset < 0 || byteOffset > bytes) return false;
      const next = adjustments[findAdjustment(byteOffset)];
      return !next || byteOffset <= next.start;
    },
  });
}
