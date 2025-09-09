/// <reference types="vite/client" />

// Temporary type definitions for oxc-playground module
declare module 'oxc-playground' {
  export interface OxcOptions {
    run: {
      lint: boolean
      formatter: boolean
      formatterIr: boolean
      transform: boolean
      isolatedDeclarations: boolean
      whitespace: boolean
      mangle: boolean
      compress: boolean
      scope: boolean
      symbol: boolean
    }
    parser: {
      extension: string
      allowReturnOutsideFunction: boolean
      preserveParens: boolean
      allowV8Intrinsics: boolean
    }
    linter: any
    transformer: {
      target: string
      useDefineForClassFields: boolean
      experimentalDecorators: boolean
      emitDecoratorMetadata: boolean
    }
    isolatedDeclarations: {
      stripInternal: boolean
    }
    codegen: {
      normal: boolean
      jsdoc: boolean
      annotation: boolean
      legal: boolean
    }
    compress: any
    mangle: {
      topLevel: boolean
      keepNames: boolean
    }
    controlFlow: {
      verbose: boolean
    }
  }

  export class Oxc {
    run(code: string, options: OxcOptions): void
    getDiagnostics(): any[]
    get codegenText(): string
    get codegenSourcemapText(): string
    get controlFlowGraph(): string
    getComments(): any[]
    get ast(): any
    get astJson(): string
    get formatterFormattedText(): string
    get ir(): string
    get scopeText(): string
    get symbolsJson(): string
  }
}
