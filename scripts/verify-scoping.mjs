// Run after building the companion oxc-playground WASM binding:
// node scripts/verify-scoping.mjs
import assert from "node:assert/strict";
import { Oxc } from "oxc-playground";
import { createSemanticSource, indexScoping, parseScoping } from "../src/utils/scoping.ts";

const oxc = new Oxc();
const options = {
  run: {
    lint: false,
    formatter: false,
    transform: false,
    isolatedDeclarations: false,
    whitespace: false,
    compress: false,
    mangle: false,
    scope: true,
    symbol: true,
    cfg: false,
  },
  parser: {
    extension: "tsx",
    sourceType: "module",
    allowReturnOutsideFunction: true,
    preserveParens: true,
    allowV8Intrinsics: true,
    semanticErrors: true,
  },
};
function analyze(code, extension = "tsx") {
  oxc.run(code, { ...options, parser: { ...options.parser, extension } });
  const data = parseScoping(oxc.scopingJson);
  assert.ok(data, "Build the companion binding with scopingJson before running this check.");
  const index = indexScoping(data);
  const source = createSemanticSource(code);
  for (const reference of data.references) {
    assert.equal(source.locate(reference.span)?.text, reference.name);
    if (reference.symbolId !== null)
      assert.ok(index.symbols.get(reference.symbolId).references.includes(reference.id));
  }
  for (const symbol of data.symbols)
    for (const id of symbol.references) assert.equal(index.references.get(id).symbolId, symbol.id);
  return { data, index };
}

try {
  assert.equal("scopeText" in oxc, false, "Legacy scope text is no longer exposed.");
  assert.equal("symbolsJson" in oxc, false, "Legacy symbol JSON is no longer exposed.");
  let { data, index } = analyze(
    "// 😀\r\nconst café=1; function outer(x) { let value=x; { let value=2; value++; } return () => value + café; }",
  );
  assert.equal(data.scopes.length, 4);
  const values = data.symbols.filter((symbol) => symbol.name === "value");
  assert.equal(values.length, 2);
  assert.equal(index.sameNameAncestor(values[1]).id, values[0].id);
  assert.equal(
    data.references.filter((reference) => reference.isRead && reference.isWrite).length,
    1,
  );
  const captured = data.references.filter(
    (reference) =>
      reference.isValue &&
      reference.symbolId !== null &&
      index.crossesFunction(reference, index.symbols.get(reference.symbolId)),
  );
  assert.deepEqual(captured.map((reference) => reference.name).sort(), ["café", "value"]);

  ({ data, index } = analyze("(function n(n) { return n; })"));
  assert.equal(data.symbols.filter((symbol) => symbol.name === "n").length, 2);
  assert.equal(index.declared.get(1).filter((symbol) => symbol.name === "n").length, 2);
  assert.equal(data.scopes.find((scope) => scope.id === 1).bindings.length, 1);

  ({ data, index } = analyze(
    "let e=0; try { throw 1; } catch (e) { var e=1; console.log(e); } console.log(e);",
    "js",
  ));
  const caught = data.symbols.find((symbol) => symbol.catchVarBindingId !== null);
  assert.ok(caught);
  assert.equal(index.symbols.get(caught.catchVarBindingId).scopeId, 0);
  assert.equal(caught.redeclarations.length, 2);

  ({ data, index } = analyze("let A={foo:1}; A.foo=2; type T=typeof A; let count=0; count++;"));
  const binding = data.symbols.find((symbol) => symbol.name === "A");
  const references = binding.references.map((id) => index.references.get(id));
  assert.ok(
    references.some(
      (reference) =>
        reference.flags.includes("MemberWriteTarget") && reference.isRead && !reference.isWrite,
    ),
  );
  assert.ok(
    references.some((reference) => reference.isType && !reference.isRead && !reference.isWrite),
  );

  ({ data } = analyze("function f() { return arguments[0] + unknown; }", "js"));
  assert.deepEqual(
    data.references
      .filter((reference) => reference.symbolId === null)
      .map((reference) => reference.name)
      .sort(),
    ["arguments", "unknown"],
  );

  ({ data, index } = analyze("const x=1; function f(a=x) { let x=2; return a; }", "js"));
  assert.equal(
    index.symbols.get(data.references.find((reference) => reference.name === "x").symbolId).scopeId,
    0,
  );
  ({ data, index } = analyze("try {} catch ({a=outside,b=a}) { console.log(a,b); }", "js"));
  const parameterReference = data.references.find((reference) => reference.name === "a");
  assert.equal(
    index.crossesFunction(parameterReference, index.symbols.get(parameterReference.symbolId)),
    false,
  );

  ({ data } = analyze("declare const café: number; export { café };", "d.ts"));
  assert.ok(data.symbols.length);
  ({ data } = analyze(""));
  assert.equal(data.scopes.length, 1);
  assert.equal(data.symbols.length, 0);
  oxc.run("let x=1", { ...options, run: { ...options.run, scope: false, symbol: false } });
  assert.equal(oxc.scopingJson, "");
  console.log("Actual WASM scoping checks passed.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  // The WASI worker pool otherwise keeps this standalone verification alive.
  process.exit(process.exitCode ?? 0);
}
