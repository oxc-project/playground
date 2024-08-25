import { createHighlighterCore } from "shiki/core";
import langJson from "shiki/langs/json.mjs";
import vitesseDark from "shiki/themes/vitesse-dark.mjs";
import vitesseLight from "shiki/themes/vitesse-light.mjs";
import getWasm from "shiki/wasm";

export const highlighterPromise = createHighlighterCore({
  themes: [vitesseLight, vitesseDark],
  langs: [langJson],
  loadWasm: getWasm,
});
