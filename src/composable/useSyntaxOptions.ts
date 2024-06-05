import { createGlobalState, useStorage } from "@vueuse/core";
import { PLAYGROUND_SYNTAX_STORAGE } from "src/utils";

export interface SyntaxOptions {
  language: string;
  sourceType: string;
  jsx: boolean;
  tsx: boolean;
  dts: boolean;
  linted: boolean;
}

export const useSyntaxOptionState = createGlobalState(() =>
  useStorage<SyntaxOptions>(PLAYGROUND_SYNTAX_STORAGE, {
    language: "typescript",
    sourceType: "module",
    jsx: false,
    tsx: true,
    dts: true,
    linted: true,
  }),
);
