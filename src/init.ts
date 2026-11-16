import { languages } from "monaco-editor/editor/editor.api";
import "monaco-editor/features/gotoSymbol/register";
import "monaco-editor/features/referenceSearch/register";
import "monaco-editor/editor/contrib/hover/browser/hoverContribution";
import "monaco-editor/languages/definitions/javascript/register";
import "monaco-editor/languages/definitions/typescript/register";
import { jsonDefaults } from "monaco-editor/language/json/monaco.contribution";
import {
  typescriptDefaults,
  ScriptTarget,
  ModuleKind,
  ModuleResolutionKind,
  JsxEmit,
} from "monaco-editor/language/typescript/monaco.contribution";
import oxfmtSchema from "@oxc/npm/oxfmt/configuration_schema.json?url";

// A separate language keeps generated code out of the source editor's TS project.
languages.register({ id: "printed-typescript" });

jsonDefaults.setDiagnosticsOptions({
  allowComments: true,
  enableSchemaRequest: true,
  trailingCommas: "ignore",
  schemas: [
    {
      uri: new URL(oxfmtSchema, import.meta.url).href,
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
