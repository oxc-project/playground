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

  function visit(node: AnyNode): void {
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
        for (const child of value) if (isNode(child)) visit(child);
      } else if (isNode(value)) {
        visit(value);
      }
    }
  }

  visit(ast);
  return { helpers: [...helpers], hasRequire };
}
