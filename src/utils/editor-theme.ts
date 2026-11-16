import * as monaco from "monaco-editor/editor/editor.api";
import { createHighlighterInstance } from "./shiki";

let registration: Promise<void> | undefined;
let registered = false;

export function getEditorTheme(isDark: boolean): string {
  if (registered) return isDark ? "oxc-dark" : "oxc-light";
  return isDark ? "vs-dark" : "vs";
}

// Call after editor contributions have loaded: defining themes initializes Monaco services.
export function registerEditorThemes(): Promise<void> {
  return (registration ??= Promise.all([
    import("@shikijs/monaco"),
    // The adapter retains the active theme's color map. Keep its registry separate
    // from HTML highlighting, which switches between both themes on every render.
    createHighlighterInstance(),
  ])
    .then(([{ shikiToMonaco }, highlighter]) => {
      shikiToMonaco(highlighter, monaco);
      registered = true;
    })
    .catch((error) => {
      registration = undefined;
      throw error;
    }));
}
