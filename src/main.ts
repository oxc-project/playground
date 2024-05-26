import { createApp } from "vue";
import App from "./App.vue";
import "./assets/index.css";
import "./assets/reset.css";

import initWasm, {
  Oxc,
  OxcRunOptions,
  OxcParserOptions,
  OxcLinterOptions,
  OxcMinifierOptions,
  OxcCodegenOptions,
} from "@oxc/oxc_wasm";

async function main() {
  await initWasm();

  // Just a demo
  const oxc = new Oxc();
  const runOptions = new OxcRunOptions();
  const parserOptions = new OxcParserOptions();
  const codegenOptions = new OxcCodegenOptions();
  const linterOptions = new OxcLinterOptions();
  const minifierOptions = new OxcMinifierOptions();
  oxc.sourceText = "const foo = bar;";
  oxc.run(
    runOptions,
    parserOptions,
    linterOptions,
    codegenOptions,
    minifierOptions,
  );
  console.log(oxc.ast);

  createApp(App).mount("#app");
}

main();
