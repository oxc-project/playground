import initWasm, {
  Oxc,
  OxcCodegenOptions,
  OxcLinterOptions,
  OxcMinifierOptions,
  OxcParserOptions,
  OxcRunOptions,
} from "@oxc/oxc_wasm";
import { createGlobalState, useAsyncState } from "@vueuse/core";
import { Ref, computed, reactive, ref, watch } from "vue";
import { editorValue, syntaxOptionState, type SyntaxOptions } from "./state";

interface OxcStore {
  oxc?: Oxc;
  options: Partial<{
    run: OxcRunOptions;
    parser: OxcParserOptions;
    linter: OxcLinterOptions;
    minifier: OxcMinifierOptions;
    codegen: OxcCodegenOptions;
  }>;
}

export interface OxcState {
  /**
   * Set to `true` when wasm runtime has initialized. Indicates that {@link oxc}
   * and {@link options} are not `undefined` and can be used.
   */
  isReady: Ref<boolean>;
  /**
   * State resulting from the most previous {@link Oxc.run run}.
   */
  oxc: Partial<
    Pick<
      Oxc,
      "ast" | "ir" | "symbols" | "scopeText" | "codegenText" | "diagnostics"
    >
  >;
  /**
   * Controls parsing, linting, codegen, and minification.
   */
  options: Ref<Partial<OxcStore["options"]>>;
  /**
   * Duration, in ms, of the most recent run. `undefined` before the first run.
   */
  duration: Ref<number | undefined>;
}

async function initialize(): Promise<OxcStore> {
  await initWasm();
  const opts = {
    oxc: new Oxc(),
    options: {
      run: new OxcRunOptions(),
      parser: new OxcParserOptions(),
      linter: new OxcLinterOptions(),
      minifier: new OxcMinifierOptions(),
      codegen: new OxcCodegenOptions(),
    },
  };
  opts.options.run.symbol = true;
  return opts;
}

export const useOxc = createGlobalState(() => {
  const runDuration = ref<number | undefined>();
  const oxcInternal = useAsyncState<OxcStore>(initialize, {
    oxc: undefined,
    options: {
      run: undefined,
      parser: undefined,
      linter: undefined,
      minifier: undefined,
      codegen: undefined,
    },
  });
  // NOTE: we can't just expose the above state b/c oxc.run() mutates itself in
  // place and updates won't propagate to the UI.
  const oxcState = reactive<
    Partial<
      Pick<
        Oxc,
        "ast" | "ir" | "symbols" | "scopeText" | "codegenText" | "diagnostics"
      >
    >
  >({
    ast: undefined,
    ir: undefined,
    symbols: undefined,
    scopeText: undefined,
    codegenText: undefined,
    diagnostics: undefined,
  });
  const options = computed(() => oxcInternal.state.value.options);

  const run = () => {
    if (!oxcInternal.isReady) {
      return;
    }
    const {
      oxc,
      options: { run, parser, linter, codegen, minifier },
    } = oxcInternal.state.value;

    if (!oxc || !run || !parser || !linter || !codegen || !minifier) {
      throw new Error(
        "[run]oxc store is ready but one or more options are missing.",
      );
    }

    const sourceFilename = getFilename(syntaxOptionState.value);
    parser.sourceFilename = sourceFilename;
    run.lint = syntaxOptionState.value.linted;
    run.syntax = true;

    const start = new Date();
    oxc.run(run, parser, linter, codegen, minifier);
    runDuration.value = new Date().getTime() - start.getTime();

    oxcState.ast = oxc.ast;
    oxcState.ir = oxc.ir;
    oxcState.symbols = oxc.symbols;
    oxcState.scopeText = oxc.scopeText;
    oxcState.codegenText = oxc.codegenText;
    oxcState.diagnostics = oxc.diagnostics;
  };

  // re-run when editor value changes
  watch(editorValue, () => {
    if (!oxcInternal.isReady.value) {
      return;
    }
    const oxc = oxcInternal.state.value.oxc;
    if (!oxc) {
      return;
    }

    if (editorValue.value == oxc.sourceText) {
      return;
    }

    oxc.sourceText = editorValue.value;
    run();
  });

  // re-run when syntax options changes
  watch(syntaxOptionState, (syntaxOption) => {
    if (!oxcInternal.isReady.value) {
      return;
    }
    const {
      options: { run: runOptions, parser },
    } = oxcInternal.state.value;

    const sourceFilename = getFilename(syntaxOption);
    const linted = syntaxOption.linted;

    if (
      parser?.sourceFilename === sourceFilename &&
      runOptions?.lint === linted
    ) {
      return;
    }

    run();
  });

  // run for the first time when wasm initializes
  watch(oxcInternal.isReady, (isReady) => {
    if (isReady) {
      oxcInternal.state.value.oxc!.sourceText = editorValue.value;
      run();
    }
  });

  // re-run when options change
  watch(oxcInternal.state, () => run());

  // NOTE: do not free() on unmount. that hook is fired any time any consuming
  // component unmounts, which messes things up for other components.

  return {
    isReady: oxcInternal.isReady,
    oxc: oxcState,
    options,
    duration: runDuration,
  };
});

function getFilename(syntaxOption: SyntaxOptions) {
  if (syntaxOption.language === "typescript") {
    if (syntaxOption.tsx) {
      return "test.tsx";
    }
    if (syntaxOption.dts) {
      return "test.d.ts";
    }
    return "test.ts";
  }

  if (syntaxOption.language === "javascript") {
    if (syntaxOption.jsx) {
      return "test.jsx";
    }

    return "test.js";
  }
}
