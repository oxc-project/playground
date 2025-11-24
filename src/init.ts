import * as monaco from 'monaco-editor'
monaco.json.jsonDefaults.setDiagnosticsOptions({
  allowComments: true,
  enableSchemaRequest: true,
  trailingCommas: 'ignore',
})

monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
  noSuggestionDiagnostics: true,
})
monaco.typescript.typescriptDefaults.setCompilerOptions({
  allowJs: true,
  target: monaco.typescript.ScriptTarget.ESNext,
  module: monaco.typescript.ModuleKind.ESNext,
  allowNonTsExtensions: true,
  moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs,
  noEmit: true,
  esModuleInterop: true,
  jsx: monaco.typescript.JsxEmit.React,
})
