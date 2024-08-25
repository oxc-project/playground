import { createGlobalState, useLocalStorage } from "@vueuse/core";
import { PLAYGROUND_CODE_STORAGE } from "src/utils";

/**
 * Global state containing the text value of the monaco code editor.
 */
export const useEditorValue = createGlobalState(() =>
  useLocalStorage(PLAYGROUND_CODE_STORAGE, ""),
);
