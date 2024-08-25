import { useLocalStorage } from "@vueuse/core";
import {
  PLAYGROUND_SYNTAX_STORAGE,
  PLAYGROUND_CODE_STORAGE,
} from "src/utils/constants";

/**
 * Global state containing the text value of the monaco code editor.
 */
export const editorValue = useLocalStorage(PLAYGROUND_CODE_STORAGE, "");

export interface SyntaxOptions {
  language: string;
  sourceType: string;
  syntax: boolean;
  jsx: boolean;
  tsx: boolean;
  dts: boolean;
  linted: boolean;
}

export const syntaxOptionState = useLocalStorage<SyntaxOptions>(
  PLAYGROUND_SYNTAX_STORAGE,
  {
    language: "typescript",
    sourceType: "module",
    syntax: true,
    jsx: false,
    tsx: true,
    dts: true,
    linted: true,
  },
);
