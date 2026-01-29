import "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
import { jsonDefaults } from "monaco-editor/esm/vs/language/json/monaco.contribution";
import {
  typescriptDefaults,
  ScriptTarget,
  ModuleKind,
  ModuleResolutionKind,
  JsxEmit,
} from "monaco-editor/esm/vs/language/typescript/monaco.contribution";

jsonDefaults.setDiagnosticsOptions({
  allowComments: true,
  enableSchemaRequest: true,
  trailingCommas: "ignore",
  schemas: [
    {
      uri: "/oxfmt-schema.json",
      fileMatch: ["formatter.json"],
    },
  ],
});

typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
  noSuggestionDiagnostics: true,
});
typescriptDefaults.setCompilerOptions({
  allowJs: true,
  target: ScriptTarget.ESNext,
  module: ModuleKind.ESNext,
  allowNonTsExtensions: true,
  moduleResolution: ModuleResolutionKind.NodeJs,
  noEmit: true,
  esModuleInterop: true,
  jsx: JsxEmit.React,
});
