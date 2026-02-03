/// <reference types="vite-plus/client" />

declare module "monaco-editor/esm/vs/editor/editor.api" {
  export * from "monaco-editor";
}

declare module "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution" {}

declare module "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution" {}

declare module "monaco-editor/esm/vs/language/json/monaco.contribution" {
  export const jsonDefaults: import("monaco-editor").languages.json.LanguageServiceDefaults;
}

declare module "monaco-editor/esm/vs/language/typescript/monaco.contribution" {
  export const typescriptDefaults: import("monaco-editor").languages.typescript.LanguageServiceDefaults;
  export const ScriptTarget: typeof import("monaco-editor").languages.typescript.ScriptTarget;
  export const ModuleKind: typeof import("monaco-editor").languages.typescript.ModuleKind;
  export const ModuleResolutionKind: typeof import("monaco-editor").languages.typescript.ModuleResolutionKind;
  export const JsxEmit: typeof import("monaco-editor").languages.typescript.JsxEmit;
}
