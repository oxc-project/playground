import assert from "node:assert/strict";
import { test } from "node:test";
import { analyzeOutput } from "../src/utils/runner-dependencies.ts";

const helper = "@oxc-project/runtime/helpers/toPropertyKey";
const otherHelper = "@oxc-project/runtime/helpers/defineProperty";

function dependencies(code: string, sourceType: "script" | "module" = "script"): string[] {
  return analyzeOutput(code, sourceType).helpers;
}

test("collects unique full helper specifiers, including nested calls", () => {
  assert.deepEqual(
    dependencies(`
      require(${JSON.stringify(helper)});
      function later() {
        return consume(require(${JSON.stringify(otherHelper)}));
      }
      require(${JSON.stringify(helper)})(require(${JSON.stringify(otherHelper)}));
    `),
    [helper, otherHelper],
  );
});

test("ignores strings, comments, property calls, constructors, and computed arguments", () => {
  assert.deepEqual(
    dependencies(`
      const text = 'require("${helper}")';
      // require("${helper}")
      /* require("${helper}") */
      object.require("${helper}");
      new require("${helper}");
      require("@oxc-project/runtime/helpers/" + "toPropertyKey");
      require(\`${helper}\`);
      const alias = require;
      alias("${helper}");
    `),
    [],
  );
});

// Each form declares a `require` binding through a different scope mechanism,
// so none of them is the global `require` a browser could not provide.
const shadowedCalls = [
  `require("${helper}"); const require = local;`,
  `function f(require) { require("${helper}"); }`,
  `({ method({ require }) { require("${helper}"); } });`,
  `function f() { require("${helper}"); if (false) { var require; } }`,
  `require("${helper}"); function require() {}`,
  `try {} catch ({ require }) { require("${helper}"); }`,
  `class require { method() { require("${helper}"); } }`,
];

for (const code of shadowedCalls) {
  test(`respects local require bindings: ${code}`, () => {
    assert.deepEqual(dependencies(code), []);
  });
}

test("local bindings do not hide require calls in sibling or enclosing scopes", () => {
  assert.deepEqual(
    dependencies(`
      { const require = local; require("${otherHelper}"); }
      function f(require) { require("${otherHelper}"); }
      const C = class require { method() { require("${otherHelper}"); } };
      class D { static { var require; require("${otherHelper}"); } }
      try {} catch (require) { require("${otherHelper}"); }
      require("${helper}");
      class E { method() { require("${helper}"); } }
    `),
    [helper],
  );
});

test("body vars do not shadow require in default parameter initializers", () => {
  assert.deepEqual(
    dependencies(`
      function f(value = require("${helper}")) {
        var require;
        require("${otherHelper}");
      }
      const g = ({ value = require("${helper}") } = {}) => {
        var require;
        require("${otherHelper}");
      };
    `),
    [helper],
  );
});

test("switch discriminant runs outside case lexical bindings", () => {
  assert.deepEqual(
    dependencies(`
      switch (require("${helper}")) {
        case 0: let require; require("${otherHelper}");
      }
    `),
    [helper],
  );
});

test("collects ESM imports, re-exports, export-all, and literal dynamic imports", () => {
  assert.deepEqual(
    dependencies(
      `
        import helper from "${helper}";
        import "${otherHelper}";
        export { default as helperAgain } from "${helper}";
        export * from "${otherHelper}";
        export * as helpers from "${helper}";
        await import("${helper}");
      `,
      "module",
    ),
    [helper, otherHelper],
  );
});

test("respects imported require bindings", () => {
  assert.deepEqual(
    dependencies(
      `import { default as require } from "${helper}"; require("${otherHelper}");`,
      "module",
    ),
    [helper],
  );
});

test("re-export names do not declare local bindings or leak a scope", () => {
  assert.deepEqual(
    dependencies(`export { require } from "${helper}"; require("${otherHelper}");`, "module"),
    [helper, otherHelper],
  );
  assert.deepEqual(
    dependencies(
      `require("${otherHelper}"); export { default } from "${helper}"; const require = local;`,
      "module",
    ),
    [helper],
  );
});

const unsupportedSpecifiers = [
  "./local.js",
  "react",
  "node:fs",
  "https://example.com/module.js",
  "@oxc-project/runtime",
  `${helper}.js`,
  `${helper}?query`,
  "@oxc-project/runtime/helpers/../toPropertyKey",
];

for (const specifier of unsupportedSpecifiers) {
  test(`rejects unsupported import dependencies: ${specifier}`, () => {
    for (const code of [
      `import ${JSON.stringify(specifier)};`,
      `export { default } from ${JSON.stringify(specifier)};`,
      `export * from ${JSON.stringify(specifier)};`,
      `import(${JSON.stringify(specifier)});`,
    ]) {
      assert.throws(() => dependencies(code, "module"), {
        message: `Unsupported import ${JSON.stringify(specifier)}. Only Oxc runtime helpers from the npm package or versioned esm.sh URLs are supported.`,
      });
    }
  });
}

test("rejects nonliteral dynamic import sources clearly", () => {
  for (const source of ["name", `\`${helper}\``, '"prefix/" + name', "42"]) {
    assert.throws(() => dependencies(`import(${source})`), {
      message: "Dynamic import requires a string literal runtime helper specifier.",
    });
  }
});

test("detects global require calls regardless of the argument or source type", () => {
  for (const sourceType of ["script", "module"] as const) {
    for (const argument of ['"node:fs"', `"${helper}.js"`, "name", ""]) {
      assert.deepEqual(analyzeOutput(`require(${argument});`, sourceType), {
        helpers: [],
        hasRequire: true,
      });
    }
  }
});

for (const code of shadowedCalls) {
  test(`local require does not block running: ${code}`, () => {
    assert.equal(analyzeOutput(code, "script").hasRequire, false);
  });
}

const esmHelper = "https://esm.sh/@oxc-project/runtime@0.158.0/helpers/toPropertyKey";
test("accepts versioned esm.sh helpers in imports and require calls", () => {
  for (const code of [
    `import helper from "${esmHelper}";`,
    `export { default } from "${esmHelper}";`,
    `export * from "${esmHelper}";`,
    `await import("${esmHelper}");`,
  ]) {
    assert.deepEqual(analyzeOutput(code, "module"), {
      helpers: [esmHelper],
      hasRequire: false,
    });
  }
  assert.deepEqual(analyzeOutput(`require("${esmHelper}");`, "script"), {
    helpers: [esmHelper],
    hasRequire: true,
  });
});

test("rejects unversioned URLs and invalid helper paths", () => {
  for (const specifier of [
    "https://esm.sh/@oxc-project/runtime/helpers/toPropertyKey",
    "https://esm.sh/@oxc-project/runtime@latest/helpers/toPropertyKey",
    esmHelper.replace("toPropertyKey", "../toPropertyKey"),
  ]) {
    assert.throws(() => dependencies(`import "${specifier}";`, "module"), /Unsupported import/);
  }
});

test("uses the requested source type and supports current JavaScript syntax", () => {
  assert.throws(() => dependencies(`import "${helper}";`, "script"), SyntaxError);
  assert.throws(() => dependencies("await 1;", "script"), SyntaxError);
  assert.deepEqual(dependencies(`await import("${helper}");`, "module"), [helper]);
  assert.deepEqual(dependencies(`import("${helper}");`, "script"), [helper]);
  assert.deepEqual(dependencies(`require?.("${helper}");`), [helper]);
  assert.deepEqual(dependencies(`require("@oxc-project/runtime/helpers/_$helper1");`), [
    "@oxc-project/runtime/helpers/_$helper1",
  ]);
  assert.throws(() => dependencies("const = ;"), SyntaxError);
});
