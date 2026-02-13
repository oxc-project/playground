import { createGlobalState, useUrlSearchParams, watchDebounced } from "@vueuse/core";
import { computed, ref, shallowRef, toRaw, triggerRef, watch, watchEffect } from "vue";
import { activeTab, editorValue, enabledLintRules, formatterPanels } from "~/composables/state";
import { PLAYGROUND_DEMO_CODE } from "~/utils/constants";
import type { Oxc, OxcOptions } from "oxc-playground";

// Sync URL state with reactive state using VueUse
// All state is stored in query params: ?t=tab&formatterPanels=...&code=...&lintRules=...
const urlParams = useUrlSearchParams<{
  t?: string;
  formatterPanels?: string;
  code?: string;
  lintRules?: string;
}>("history", { removeFalsyValues: true });

// Initialize state from URL (runs synchronously at module load)
if (urlParams.t) {
  activeTab.value = urlParams.t;
}
if (urlParams.formatterPanels) {
  const enabledPanels = urlParams.formatterPanels.split(",");
  formatterPanels.value = {
    output: enabledPanels.includes("output"),
    ir: enabledPanels.includes("ir"),
    prettier: enabledPanels.includes("prettier"),
    prettierDoc: enabledPanels.includes("prettierDoc"),
  };
}
if (urlParams.lintRules) {
  enabledLintRules.value = urlParams.lintRules.split(",").filter(Boolean);
}
editorValue.value = urlParams.code || PLAYGROUND_DEMO_CODE;

async function initialize(): Promise<Oxc> {
  const { Oxc } = await import("oxc-playground");
  return new Oxc();
}

export const loadingOxc = ref(true);
export const oxcPromise = initialize().finally(() => (loadingOxc.value = false));

export const defaultFormatterConfig = {
  useTabs: false,
  tabWidth: 2,
  endOfLine: "lf",
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  semi: true,
  arrowParens: "always",
  bracketSpacing: true,
  bracketSameLine: false,
  objectWrap: "preserve",
  singleAttributePerLine: false,
  experimentalSortImports: undefined,
};

export const useOxc = createGlobalState(async () => {
  const options = ref<Required<OxcOptions>>({
    run: {
      lint: true,
      formatter: false,
      transform: false,
      isolatedDeclarations: false,
      whitespace: false,
      mangle: false,
      compress: false,
      scope: true,
      symbol: true,
      cfg: true,
    },
    parser: {
      extension: "tsx",
      allowReturnOutsideFunction: true,
      preserveParens: true,
      allowV8Intrinsics: true,
      semanticErrors: true,
    },
    linter: {},
    formatter: { ...defaultFormatterConfig },
    transformer: {
      target: "es2015",
      useDefineForClassFields: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    },
    isolatedDeclarations: {
      stripInternal: false,
    },
    codegen: {
      normal: true,
      jsdoc: true,
      annotation: true,
      legal: true,
    },
    compress: {},
    mangle: {
      topLevel: true,
      keepNames: false,
    },
    controlFlow: {
      verbose: false,
    },
    inject: { inject: {} },
    define: { define: {} },
  });
  const oxc = await oxcPromise;
  const state = shallowRef(oxc);
  const error = ref<unknown>();

  function run() {
    const errors: unknown[] = [];
    const originalError = console.error;
    console.error = function (...msgs) {
      errors.push(...msgs);
      return originalError.apply(this, msgs);
    };
    try {
      const rawOptions = toRaw(options.value);
      if (typeof rawOptions?.linter?.config === "object") {
        rawOptions.linter.config = JSON.stringify(rawOptions.linter.config);
      }
      oxc.run(editorValue.value, rawOptions);
      // Reset error if successful
      error.value = undefined;
    } catch (caughtError) {
      console.error(caughtError);
      error.value = errors.length ? errors : caughtError;
    }
    console.error = originalError;
    triggerRef(state);
  }
  watch([options, editorValue, activeTab], run, { deep: true });

  // Sync tab and formatter panels to URL (reactive, no debounce needed)
  watchEffect(() => {
    urlParams.t = activeTab.value !== "codegen" ? activeTab.value : undefined;
    const enabledPanels = Object.entries(formatterPanels.value)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);
    urlParams.formatterPanels =
      enabledPanels.length === 1 && enabledPanels[0] === "output"
        ? undefined
        : enabledPanels.join(",");
  });

  // Sync enabled lint rules to URL (reactive, no debounce needed)
  watchEffect(() => {
    urlParams.lintRules =
      enabledLintRules.value.length > 0 ? enabledLintRules.value.join(",") : undefined;
  });

  // Sync code to URL (debounced to avoid excessive updates while typing)
  watchDebounced(
    () => editorValue.value,
    (code) => {
      urlParams.code = code === PLAYGROUND_DEMO_CODE || !code ? undefined : code;
    },
    { debounce: 1000 },
  );

  const monacoLanguage = computed(() => {
    const filename = `test.${options.value.parser.extension}`;
    const ext = filename.split(".").pop()!;
    if (["ts", "mts", "cts", "tsx"].includes(ext)) return "typescript";
    if (["js", "mjs", "cjs", "jsx"].includes(ext)) return "javascript";
    return "plaintext";
  });

  // NOTE: do not free() on unmount. that hook is fired any time any consuming
  // component unmounts, which messes things up for other components.

  return {
    oxc: state,
    error,
    options,
    monacoLanguage,
  };
});
