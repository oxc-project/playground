import initWasm, {
  Oxc,
  type OxcCodegenOptions,
  type OxcLinterOptions,
  type OxcMinifierOptions,
  type OxcParserOptions,
  type OxcRunOptions,
} from "@oxc/oxc_wasm";
import { createGlobalState, useAsyncState } from "@vueuse/core";
import { computed, reactive, ref, triggerRef, watch } from "vue";
import { editorValue, syntaxOptionState, type SyntaxOptions } from "./state";

interface OxcOptions {
  run: OxcRunOptions;
  parser: OxcParserOptions;
  linter: OxcLinterOptions;
  minifier: OxcMinifierOptions;
  codegen: OxcCodegenOptions;
}

async function initialize(): Promise<Oxc> {
  await initWasm();
  return new Oxc();
}

export const useOxc = createGlobalState(() => {
  const runDuration = ref<number>();

  const options = reactive<OxcOptions>({
    run: {
      syntax: true,
    },
    parser: {},
    linter: {},
    minifier: {},
    codegen: {},
  });
  const { state: core, isReady } = useAsyncState(initialize, undefined);
  const state = computed(() => core.value);

  function run() {
    if (!isReady.value) return;
    const oxc = core.value;
    if (!oxc) {
      throw new Error(
        "[run] oxc store is ready but oxc instance is undefined.",
      );
    }

    const start = performance.now();
    oxc.sourceText = editorValue.value;
    oxc.run(
      options.run,
      options.parser,
      options.linter,
      options.codegen,
      options.minifier,
    );
    runDuration.value = performance.now() - start;
    triggerRef(state);
  }

  watch([isReady, core, options, editorValue], run, { deep: true });

  // set oxc options when syntax options change
  watch(
    syntaxOptionState,
    (syntaxOption) => {
      options.parser.sourceType = syntaxOption.sourceType;
      options.parser.sourceFilename = `test.${getExtname(syntaxOption)}`;
      options.run.lint = syntaxOption.linted;
    },
    { deep: true, immediate: true },
  );

  // NOTE: do not free() on unmount. that hook is fired any time any consuming
  // component unmounts, which messes things up for other components.

  return {
    isReady,
    oxc: state,
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
