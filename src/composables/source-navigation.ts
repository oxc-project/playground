import type { IRange } from "monaco-editor";
import type { InjectionKey } from "vue";

// Source maps already use UTF-16 line/column coordinates. Keep this separate
// from diagnostic navigation, whose offsets are UTF-8 bytes.
export const sourceNavigationKey: InjectionKey<(range: IRange) => void> =
  Symbol("source-navigation");
