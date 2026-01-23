import { createGlobalState, watchDebounced } from "@vueuse/core";
import { computed, ref, shallowRef, toRaw, triggerRef, watch } from "vue";
import { activeTab, editorValue, formatterPanels } from "~/composables/state";
import { PLAYGROUND_DEMO_CODE } from "~/utils/constants";
import type { Oxc, OxcOptions } from "oxc-playground";

// Parse URL state synchronously at module load time
// This ensures state is restored before any component mounts
// All state is stored in query params: ?t=tab&formatterPanels=...&code=...
const urlParams = new URLSearchParams(location.search);
const tabParam = urlParams.get("t");
if (tabParam) {
  activeTab.value = tabParam;
}
const formatterPanelsParam = urlParams.get("formatterPanels");
if (formatterPanelsParam) {
  const enabledPanels = formatterPanelsParam.split(",");
  formatterPanels.value = {
    output: enabledPanels.includes("output"),
    ir: enabledPanels.includes("ir"),
    prettier: enabledPanels.includes("prettier"),
    prettierDoc: enabledPanels.includes("prettierDoc"),
  };
}

const codeParam = urlParams.get("code");
editorValue.value = codeParam || PLAYGROUND_DEMO_CODE;

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

  // Update URL when tab changes (no debounce needed)
  watch(activeTab, (tab) => {
    const url = new URL(location.href);
    if (tab && tab !== "codegen") {
      url.searchParams.set("t", tab);
    } else {
      url.searchParams.delete("t");
    }
    history.replaceState({}, "", url.toString());
  });

  // Update URL when formatter panels change (no debounce needed)
  watch(
    formatterPanels,
    (panels) => {
      const url = new URL(location.href);
      const enabledPanels = Object.entries(panels)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name);
      // Default is only "output" enabled
      if (enabledPanels.length === 1 && enabledPanels[0] === "output") {
        url.searchParams.delete("formatterPanels");
      } else {
        url.searchParams.set("formatterPanels", enabledPanels.join(","));
      }
      history.replaceState({}, "", url.toString());
    },
    { deep: true },
  );

  // Update URL when code changes (debounced)
  watchDebounced(
    () => editorValue.value,
    (code) => {
      const url = new URL(location.href);
      if (code === PLAYGROUND_DEMO_CODE || !code) {
        url.searchParams.delete("code");
      } else {
        url.searchParams.set("code", code);
      }
      history.replaceState({}, "", url.toString());
    },
    { debounce: 2000 },
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
