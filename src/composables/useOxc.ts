import initWasm, { Oxc, type OxcOptions } from "@oxc/oxc_wasm";
import { createGlobalState } from "@vueuse/core";
import { computed, reactive, ref, toRaw, triggerRef, watch } from "vue";
import { editorValue, syntaxOptionState, type SyntaxOptions } from "./state";

async function initialize(): Promise<Oxc> {
  await initWasm();
  return new Oxc();
}

export const useOxc = createGlobalState(async () => {
  const runDuration = ref<number>();

  const options = reactive<Required<OxcOptions>>({
    run: {
      syntax: true,
      scope: true,
      symbol: true,
      prettierIr: true,
      prettierFormat: true,
    },
    parser: {},
    linter: {},
    minifier: {},
    codegen: {},
    typeChecking: {},
  });
  const oxc = await initialize();
  const state = computed(() => oxc);
  const error = ref<unknown>();

  function run() {
    const start = performance.now();
    try {
      oxc.run(editorValue.value, toRaw(options));
    } catch (error_) {
      console.error(error_);
      error.value = error_;
    }
    runDuration.value = performance.now() - start;
    triggerRef(state);
  }
  watch([options, editorValue], run, { deep: true });

  // set oxc options when syntax options change
  watch(
    syntaxOptionState,
    (syntaxOption) => {
      options.parser.sourceType = syntaxOption.sourceType;
      options.parser.sourceFilename = `test.${getExtname(syntaxOption)}`;
      options.parser.preserveParens = syntaxOption.preserveParens;
      options.run.lint = syntaxOption.linted;
    },
    { deep: true, immediate: true },
  );

  // NOTE: do not free() on unmount. that hook is fired any time any consuming
  // component unmounts, which messes things up for other components.

  return {
    oxc: state,
    error,
    options,
    duration: runDuration,
  };
});

function getExtname(syntaxOption: SyntaxOptions) {
  if (syntaxOption.language === "typescript") {
    if (syntaxOption.tsx) {
      return "tsx";
    }
    if (syntaxOption.dts) {
      return "d.ts";
    }
    return "ts";
  }
  if (syntaxOption.language === "javascript") {
    if (syntaxOption.jsx) {
      return "jsx";
    }
    return "js";
  }
}
