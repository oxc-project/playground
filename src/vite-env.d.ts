/// <reference types="vite/client" />
// declare module 'monaco-editor/esm/vs/language/json/jsonMode.js';
declare module 'monaco-editor/esm/vs/language/json/monaco.contribution.js' {
  type m = typeof import('monaco-editor').languages.json
  export = m
}

declare module 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js' {
  type m = typeof import('monaco-editor').languages.typescript
  export = m
}
