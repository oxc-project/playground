import { parse, type AnyNode } from "acorn";
import { analyze } from "eslint-scope";

const helperPattern =
  /^(?:@oxc-project\/runtime|https:\/\/esm\.sh\/@oxc-project\/runtime@\d+\.\d+\.\d+(?:-[\w.-]+)?)\/helpers\/[A-Za-z_$][\w$]*$/;

function isHelper(specifier: string): boolean {
  return helperPattern.test(specifier);
}

function isNode(value: unknown): value is AnyNode {
  return value !== null && typeof value === "object" && "type" in value;
}

export function analyzeOutput(
  code: string,
  sourceType: "script" | "module",
): { helpers: string[]; hasRequire: boolean } {
  const ast = parse(code, { ecmaVersion: "latest", sourceType, ranges: true });
  const { globalScope } = analyze(ast as unknown as Parameters<typeof analyze>[0], {
    ecmaVersion: 2025,
    sourceType,
    // Resolve declared script globals statically, including var and function bindings.
    optimistic: true,
    ignoreEval: true,
  });
  const globalRequires = new Set<object>(
    globalScope?.through
      .filter((reference) => reference.identifier.name === "require")
      .map((reference) => reference.identifier),
  );
  const helpers = new Set<string>();
  let hasRequire = false;

  function addImport(source: AnyNode): void {
    if (source.type !== "Literal" || typeof source.value !== "string") {
      throw new Error("Dynamic import requires a string literal runtime helper specifier.");
    }
    if (!isHelper(source.value)) {
      throw new Error(
        `Unsupported import ${JSON.stringify(source.value)}. Only Oxc runtime helpers from the npm package or versioned esm.sh URLs are supported.`,
      );
    }
    helpers.add(source.value);
  }

  function isTypeofGuard(node: AnyNode | undefined): boolean {
    return node?.type === "UnaryExpression" && node.operator === "typeof";
  }

  function visit(node: AnyNode, parent?: AnyNode): void {
    // `typeof require` probes the global without calling it, but any other use of
    // an unresolved global require, including an alias, cannot run in a browser.
    if (node.type === "Identifier" && globalRequires.has(node) && !isTypeofGuard(parent)) {
      hasRequire = true;
    }
    switch (node.type) {
      case "ImportDeclaration":
      case "ExportAllDeclaration":
        addImport(node.source);
        break;
      case "ExportNamedDeclaration":
        if (node.source) addImport(node.source);
        break;
      case "ImportExpression":
        addImport(node.source);
        break;
      case "CallExpression": {
        if (globalRequires.has(node.callee)) {
          hasRequire = true;
          const argument = node.arguments[0];
          if (
            argument?.type === "Literal" &&
            typeof argument.value === "string" &&
            isHelper(argument.value)
          ) {
            helpers.add(argument.value);
          }
        }
        break;
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        for (const child of value) if (isNode(child)) visit(child, node);
      } else if (isNode(value)) {
        visit(value, node);
      }
    }
  }

  visit(ast);
  return { helpers: [...helpers], hasRequire };
}
