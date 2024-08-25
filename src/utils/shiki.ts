import { createHighlighterCore } from "shiki/core";
import getWasm from "shiki/wasm";
import vitesseLight from "shiki/themes/vitesse-light.mjs";
import vitesseDark from "shiki/themes/vitesse-dark.mjs";
import langJson from "shiki/langs/json.mjs";

export const highlighter = await createHighlighterCore({
  themes: [vitesseLight, vitesseDark],
  langs: [langJson],
  loadWasm: getWasm,
});
