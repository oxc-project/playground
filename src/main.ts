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
  createApp(App).mount("#app");
}

main();
