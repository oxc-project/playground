import { computed, toValue } from "vue";
import { editorValue } from "~/composables/state";
import { createSourceRangeMapper } from "~/utils/source-range";
import type { IRange } from "monaco-editor";
import type { InjectionKey, MaybeRefOrGetter } from "vue";
import type { SourceOffsetEncoding } from "~/utils/source-range";

// Source maps already use UTF-16 line/column coordinates. Keep this separate
// from diagnostic navigation, whose offsets are UTF-8 bytes.
export const sourceNavigationKey: InjectionKey<(range: IRange) => void> =
  Symbol("source-navigation");

// Share the source scan across all visible tree entries and rebuild it on edits.
const sourceMappers = {
  utf8: computed(() => createSourceRangeMapper(editorValue.value, "utf8")),
  utf16: computed(() => createSourceRangeMapper(editorValue.value, "utf16")),
};

export function useSourceRange(span: MaybeRefOrGetter<unknown>, encoding: SourceOffsetEncoding) {
  return computed(() => sourceMappers[encoding].value(toValue(span)));
}
