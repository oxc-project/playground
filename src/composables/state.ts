import { useDark } from "@vueuse/core";
import { PLAYGROUND_DEMO_CODE } from "src/utils/constants";
import { atou, utoa } from "src/utils/url";
import { ref, watchEffect } from "vue";

export const editorValue = ref("");

export interface SyntaxOptions {
  language: string;
  sourceType: "module" | "script";
  syntax: boolean;
  jsx: boolean;
  tsx: boolean;
  dts: boolean;
  linted: boolean;
}

export const syntaxOptionState = ref<SyntaxOptions>({
  language: "typescript",
  sourceType: "module",
  syntax: true,
  jsx: false,
  tsx: true,
  dts: false,
  linted: true,
});

const rawUrlState = atou(location.hash!.slice(1));
const urlState = rawUrlState && JSON.parse(rawUrlState);
if (rawUrlState) {
  syntaxOptionState.value = urlState.o;
}
editorValue.value = urlState?.c || PLAYGROUND_DEMO_CODE;

watchEffect(() => {
  const serialized = JSON.stringify({
    c: editorValue.value === PLAYGROUND_DEMO_CODE ? "" : editorValue.value,
    o: syntaxOptionState.value,
  });
  location.hash = utoa(serialized);
});

export const dark = useDark();
