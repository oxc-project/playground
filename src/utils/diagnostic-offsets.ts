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

  return (byteOffset: number) => {
    const offset = Math.max(0, Math.min(byteOffset, bytes));
    let low = 0;
    let high = adjustments.length;
    while (low < high) {
      const middle = (low + high) >>> 1;
      if (adjustments[middle]!.end <= offset) low = middle + 1;
      else high = middle;
    }
    const next = adjustments[low];
    // A byte inside a multibyte character belongs to that character's start.
    if (next && offset >= next.start) return next.utf16Start;
    return offset - (adjustments[low - 1]?.difference ?? 0);
  };
}
