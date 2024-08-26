import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import langJson from "shiki/langs/json.mjs";
import langTsx from "shiki/langs/tsx.mjs";
import vitesseDark from "shiki/themes/vitesse-dark.mjs";
import vitesseLight from "shiki/themes/vitesse-light.mjs";
import getWasm from "shiki/wasm";
import { dark } from "src/composables/state";

export const highlighterPromise = createHighlighterCore({
  themes: [vitesseLight, vitesseDark],
  langs: [langJson, langTsx],
  loadWasm: getWasm,
});

export type ShikiLang = "json" | "tsx";

export function highlight(
  highlighter: HighlighterCore,
  code: string,
  lang: ShikiLang,
) {
  return highlighter.codeToHtml(code, {
    lang,
    theme: dark.value ? "vitesse-dark" : "vitesse-light",
    transformers: [
      {
        name: "add-style",
        pre(node) {
          this.addClassToHast(node, "!bg-transparent p-2");
        },
      },
    ],
  });
}
