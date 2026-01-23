import { createGlobalState } from "@vueuse/core";
import type { Doc, Options, Plugin } from "prettier";
import * as prettierStandalone from "prettier/standalone";
import { ref } from "vue";

// Extend types for version and undocumented __debug API
const prettier = prettierStandalone as typeof prettierStandalone & {
  version: string;
  __debug: {
    printToDoc: (code: string, options: Options) => Promise<Doc>;
  };
};

let plugins: Plugin[];

const prettierReady = Promise.all([
  import("prettier/plugins/typescript"),
  import("prettier/plugins/estree"),
]).then(([ts, estree]) => {
  plugins = [ts.default, estree.default];
});

// Format doc IR as readable string
function formatDoc(doc: Doc, indent = 0): string {
  const pad = "  ".repeat(indent);

  if (typeof doc === "string") {
    return `${pad}${JSON.stringify(doc)}`;
  }

  if (Array.isArray(doc)) {
    if (doc.length === 0) return `${pad}[]`;
    const items = doc.map((d) => formatDoc(d, indent + 1)).join(",\n");
    return `${pad}[\n${items}\n${pad}]`;
  }

  if (doc && typeof doc === "object") {
    const obj = doc as unknown as Record<string, unknown>;
    if (obj.type) {
      const type = obj.type as string;
      const props = Object.entries(obj)
        .filter(([k]) => k !== "type")
        .map(([k, v]) => {
          if (k === "contents" || k === "parts") {
            return `${pad}  ${k}:\n${formatDoc(v as Doc, indent + 2)}`;
          }
          return `${pad}  ${k}: ${JSON.stringify(v)}`;
        })
        .join(",\n");
      return props ? `${pad}${type}(\n${props}\n${pad})` : `${pad}${type}`;
    }
  }

  return `${pad}${JSON.stringify(doc)}`;
}

export const usePrettier = createGlobalState(async () => {
  await prettierReady;

  const prettierOutput = ref("");
  const prettierDocOutput = ref("");
  const prettierError = ref("");

  async function format(code: string, options: Options) {
    try {
      prettierError.value = "";

      const formatOptions = { ...options, parser: "typescript" as const, plugins };

      prettierOutput.value = await prettier.format(code, formatOptions);

      const doc = await prettier.__debug.printToDoc(code, formatOptions);
      prettierDocOutput.value = formatDoc(doc);
    } catch (error) {
      prettierError.value = error instanceof Error ? error.message : String(error);
      prettierOutput.value = "";
      prettierDocOutput.value = "";
    }
  }

  return {
    prettierOutput,
    prettierDocOutput,
    prettierError,
    prettierVersion: prettier.version,
    format,
  };
});
