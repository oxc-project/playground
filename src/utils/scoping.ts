export interface ByteSpan {
  start: number;
  end: number;
}

export interface SemanticScope {
  id: number;
  parentId: number | null;
  nodeId: number;
  kind: string;
  span: ByteSpan;
  flags: string;
  flagsBits: number;
  isFunction: boolean;
  bindings: number[];
}

export interface SemanticSymbol {
  id: number;
  name: string;
  span: ByteSpan;
  flags: string;
  flagsBits: number;
  scopeId: number;
  nodeId: number;
  redeclarations: { span: ByteSpan; nodeId: number; flags: string }[];
  catchVarBindingId: number | null;
  references: number[];
}

export interface SemanticReference {
  id: number;
  name: string;
  nodeId: number;
  span: ByteSpan;
  scopeId: number;
  symbolId: number | null;
  flags: string;
  flagsBits: number;
  isRead: boolean;
  isWrite: boolean;
  isType: boolean;
  isValue: boolean;
}

export interface ScopingData {
  version: 1;
  offsetEncoding: "utf8";
  scopes: SemanticScope[];
  symbols: SemanticSymbol[];
  references: SemanticReference[];
}

export function parseScoping(json: string | undefined): ScopingData | undefined {
  if (!json) return;
  const value = JSON.parse(json);
  if (
    value.version !== 1 ||
    value.offsetEncoding !== "utf8" ||
    !Array.isArray(value.scopes) ||
    !Array.isArray(value.symbols) ||
    !Array.isArray(value.references)
  ) {
    throw new Error("Unsupported scoping data. Rebuild the Oxc Playground binding.");
  }
  return value;
}

export function indexScoping(data: ScopingData) {
  const scopes = new Map(data.scopes.map((scope) => [scope.id, scope]));
  const symbols = new Map(data.symbols.map((symbol) => [symbol.id, symbol]));
  const references = new Map(data.references.map((reference) => [reference.id, reference]));
  const children = new Map<number | null, SemanticScope[]>();
  const scopeReferences = new Map<number, SemanticReference[]>();
  const declared = new Map<number, SemanticSymbol[]>();
  for (const symbol of data.symbols) {
    const items = declared.get(symbol.scopeId) ?? [];
    items.push(symbol);
    declared.set(symbol.scopeId, items);
  }
  for (const scope of data.scopes) {
    const siblings = children.get(scope.parentId) ?? [];
    siblings.push(scope);
    children.set(scope.parentId, siblings);
  }
  for (const reference of data.references) {
    const items = scopeReferences.get(reference.scopeId) ?? [];
    items.push(reference);
    scopeReferences.set(reference.scopeId, items);
  }
  for (const items of children.values())
    items.sort((a, b) => a.span.start - b.span.start || a.id - b.id);

  function ancestors(scopeId: number) {
    const result: SemanticScope[] = [];
    const seen = new Set<number>();
    let current = scopes.get(scopeId);
    while (current && !seen.has(current.id)) {
      result.push(current);
      seen.add(current.id);
      current = current.parentId === null ? undefined : scopes.get(current.parentId);
    }
    return result;
  }

  // Report the lexical relationship directly. A same-name TS type declaration
  // does not necessarily shadow the value namespace, so do not call this shadowing.
  function sameNameAncestor(symbol: SemanticSymbol) {
    for (const scope of ancestors(symbol.scopeId).slice(1)) {
      const match = scope.bindings
        .map((id) => symbols.get(id))
        .find((outer) => outer?.name === symbol.name);
      if (match) return match;
    }
  }

  function crossesFunction(reference: SemanticReference, symbol: SemanticSymbol) {
    const path = ancestors(reference.scopeId);
    const owner = path.findIndex((scope) => scope.id === symbol.scopeId);
    return owner > 0 && path.slice(0, owner).some((scope) => scope.isFunction);
  }

  return {
    scopes,
    symbols,
    references,
    children,
    declared,
    scopeReferences,
    ancestors,
    sameNameAncestor,
    crossesFunction,
  };
}

// All semantic spans use UTF-8 bytes. Validate endpoints rather than rounding a
// partial code point; AST and source-map offsets must never enter this mapper.
export function createSemanticSource(source: string) {
  const lines = source.split(/\r\n|\r|\n/);
  const positions = new Map<number, { offset: number; lineNumber: number; column: number }>();
  let byte = 0;
  let offset = 0;
  let lineNumber = 1;
  let column = 1;
  let previousCR = false;
  for (const character of source) {
    positions.set(byte, { offset, lineNumber, column });
    const codePoint = character.codePointAt(0)!;
    byte += codePoint <= 0x7f ? 1 : codePoint <= 0x7ff ? 2 : codePoint <= 0xffff ? 3 : 4;
    offset += character.length;
    if (character === "\r") {
      lineNumber++;
      column = 1;
    } else if (character === "\n") {
      if (!previousCR) lineNumber++;
      column = 1;
    } else if (!(offset === 1 && character === "﻿")) {
      column += character.length;
    }
    previousCR = character === "\r";
  }
  positions.set(byte, { offset, lineNumber, column });

  function locate(span: ByteSpan) {
    if (
      !Number.isInteger(span.start) ||
      !Number.isInteger(span.end) ||
      span.start < 0 ||
      span.end <= span.start
    )
      return;
    const start = positions.get(span.start);
    const end = positions.get(span.end);
    if (!start || !end) return;
    return {
      start,
      end,
      range: {
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column,
      },
      text: source.slice(start.offset, end.offset),
      snippet: lines[start.lineNumber - 1]?.trim() ?? "",
    };
  }
  return { locate };
}

export function referenceUsage(reference: SemanticReference) {
  return (
    [
      reference.isRead && "read",
      reference.isWrite && "write",
      reference.isType && "type",
      !reference.isRead && !reference.isWrite && reference.isValue && "value",
    ]
      .filter(Boolean)
      .join(" + ") || "reference"
  );
}
