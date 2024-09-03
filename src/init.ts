// @ts-nocheck
import * as json from 'monaco-editor/esm/vs/language/json/monaco.contribution'
import * as typescript from 'monaco-editor/esm/vs/language/typescript/monaco.contribution'

json.jsonDefaults.setDiagnosticsOptions({
  allowComments: true,
  enableSchemaRequest: true,
  trailingCommas: 'ignore',
})

typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
  noSuggestionDiagnostics: true,
})
typescript.typescriptDefaults.setCompilerOptions({
  allowJs: true,
  target: typescript.ScriptTarget.ESNext,
  module: typescript.ModuleKind.ESNext,
  allowNonTsExtensions: true,
  moduleResolution: typescript.ModuleResolutionKind.NodeJs,
  noEmit: true,
  esModuleInterop: true,
  jsx: typescript.JsxEmit.React,
})
