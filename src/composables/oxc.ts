import { createGlobalState, useUrlSearchParams, watchDebounced } from "@vueuse/core";
import { computed, ref, shallowRef, toRaw, triggerRef, watch, watchEffect } from "vue";
import {
  activeTab,
  compareEnabled,
  editorValue,
  enabledLintRules,
  formatterPanels,
  helperRuntime,
  scopingView,
} from "~/composables/state";
import { PLAYGROUND_DEMO_CODE } from "~/utils/constants";
import { LINT_PLUGINS, getRequiredPlugins } from "~/utils/linter-rules";
import type { Oxc, OxcOptions } from "oxc-playground";

// Sync URL state with reactive state using VueUse
// All state is stored in query params: ?t=tab&formatterPanels=...&code=...&lintRules=...
const urlParams = useUrlSearchParams<{
  t?: string;
  scopingView?: string;
  formatterPanels?: string;
  options?: string;
  code?: string;
  lintRules?: string;
  helpers?: string;
  compare?: string;
}>("history", { removeFalsyValues: true });

// Initialize state from URL (runs synchronously at module load)
if (urlParams.t) {
  // Keep existing shared Scope/Symbol links working in the unified explorer.
  activeTab.value = ["scope", "symbol"].includes(urlParams.t) ? "scoping" : urlParams.t;
}
if (urlParams.t === "symbol" || urlParams.scopingView === "bindings") {
  scopingView.value = "bindings";
}
if (urlParams.formatterPanels) {
  const enabledPanels = urlParams.formatterPanels.split(",");
  Object.assign(formatterPanels, {
    output: enabledPanels.includes("output"),
    ir: enabledPanels.includes("ir"),
    prettier: enabledPanels.includes("prettier"),
    prettierDoc: enabledPanels.includes("prettierDoc"),
  });
}
if (urlParams.lintRules) {
  enabledLintRules.value = urlParams.lintRules.split(",").filter(Boolean);
}
if (urlParams.helpers === "esm") {
  helperRuntime.value = "esm";
}
compareEnabled.value = urlParams.compare === "1";
editorValue.value = urlParams.code || PLAYGROUND_DEMO_CODE;

const oxcModule = import("oxc-playground");
export const loadingOxc = ref(true);
export const oxcPromise = oxcModule
  .then(({ Oxc }) => new Oxc())
  .finally(() => (loadingOxc.value = false));

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

export const defaultOptions: Required<OxcOptions> = {
  run: {
    lint: true,
    formatter: false,
    transform: false,
    isolatedDeclarations: false,
    whitespace: false,
    mangle: false,
    mangleProps: false,
    compress: false,
    scope: true,
    symbol: true,
    cfg: true,
  },
  parser: {
    extension: "tsx",
    sourceType: "module",
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
    optimizeEnums: true,
    optimizeConstEnums: true,
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
  compress: {
    dropDebugger: true,
    dropConsole: false,
    joinVars: true,
    sequences: true,
    unused: true,
    keepNames: false,
  },
  mangle: {
    topLevel: true,
    keepNames: false,
  },
  mangleProps: {
    include: "_$",
    exclude: undefined,
    reserved: [],
    quoted: false,
    debug: false,
  },
  controlFlow: {
    verbose: false,
  },
  inject: { inject: {} },
  define: { define: {} },
};

const defaultOptionsSerialized = JSON.stringify(defaultOptions);

// Use the same defaults for older URLs and partial JSON edits. New optional
// binding fields must behave consistently in the compiler and the controls.
export function resolveOptions(saved?: Partial<OxcOptions>): Required<OxcOptions> {
  const options = structuredClone(defaultOptions);
  for (const [section, values] of Object.entries(options)) {
    Object.assign(values, saved?.[section as keyof OxcOptions]);
  }
  // Preserve extension/content detection for old saved options using explicit modes.
  if (saved && saved.parser?.sourceType == null) {
    const extension = options.parser.extension.split(".").pop();
    options.parser.sourceType =
      extension === "mjs" || extension === "mts"
        ? "module"
        : extension === "cjs" || extension === "cts"
          ? "commonjs"
          : "unambiguous";
  }
  return options;
}

export const useOxc = createGlobalState(async () => {
  const options = ref(
    resolveOptions(urlParams.options ? JSON.parse(urlParams.options) : undefined),
  );
  const oxc = await oxcPromise;
  const { Oxc: OxcConstructor } = await oxcModule;
  const state = shallowRef(oxc);
  const error = ref<unknown>();
  const semanticSource = ref<string>();
  const baselineCode = ref("");
  const baselineSourcemap = ref("");
  const baselineError = ref<string>();
  let baselineOxc: Oxc | undefined;
  const helperModuleName = computed(() => {
    const runtimeVersion = import.meta.env.OXC_RUNTIME_VERSION;
    return helperRuntime.value === "esm" && runtimeVersion
      ? `https://esm.sh/@oxc-project/runtime@${runtimeVersion}`
      : undefined;
  });

  // Compute the linter config directly from enabledLintRules so it's always
  // in sync when run() fires — this avoids a fragile two-watcher chain where
  // a component-level watcher in Linter.vue had to update options.linter
  // before the run() watcher could pick it up.
  const linterConfig = computed(() => {
    const rules = enabledLintRules.value;
    if (rules.length === 0) return {};

    const requiredPlugins = getRequiredPlugins(rules);
    const rulesConfig: Record<string, string> = {};
    for (const rule of rules) {
      rulesConfig[rule] = "error";
    }

    const config: Record<string, unknown> = {
      categories: { correctness: "off" },
      rules: rulesConfig,
    };

    if (requiredPlugins.length > 0) {
      const defaultPlugins = LINT_PLUGINS.filter((p) => p.isDefault).map((p) => p.id);
      config.plugins = [...defaultPlugins, ...requiredPlugins];
    }

    return config;
  });

  function getRunOptions() {
    return {
      ...toRaw(options.value),
      transformer: {
        ...toRaw(options.value.transformer),
        helperModuleName: helperModuleName.value,
      },
    };
  }

  // OxcError does not expose whether an error came from the compiler or linter.
  // Only when errors and enabled lint rules overlap, lazily check without linting.
  let diagnosticOxc: Oxc | undefined;
  const compilationErrors = computed(() => {
    if (error.value) {
      const errors = Array.isArray(error.value) ? error.value : [error.value];
      return errors.map((value) => (value instanceof Error ? value.message : String(value)));
    }
    const diagnostics = state.value
      .getDiagnostics()
      .filter((diagnostic) => diagnostic.severity === "Error");
    if (!diagnostics.length || !options.value.run.lint || !enabledLintRules.value.length) {
      return diagnostics.map((diagnostic) => diagnostic.message);
    }
    diagnosticOxc ??= new OxcConstructor();
    const rawOptions = getRunOptions();
    try {
      diagnosticOxc.run(editorValue.value, {
        ...rawOptions,
        run: { ...rawOptions.run, lint: false },
        linter: {},
      });
      return diagnosticOxc
        .getDiagnostics()
        .filter((diagnostic) => diagnostic.severity === "Error")
        .map((diagnostic) => diagnostic.message);
    } catch (caughtError) {
      return [caughtError instanceof Error ? caughtError.message : String(caughtError)];
    }
  });

  function run() {
    const errors: unknown[] = [];
    const originalError = console.error;
    console.error = function (...msgs) {
      errors.push(...msgs);
      return originalError.apply(this, msgs);
    };
    try {
      const rawOptions = getRunOptions();

      // Build linter config from enabledLintRules directly, ensuring it's
      // always up-to-date when run() fires (no dependency on external watcher)
      const config = linterConfig.value;
      if (Object.keys(config).length === 0) {
        rawOptions.linter = {};
      } else {
        rawOptions.linter = { config: JSON.stringify(config) };
      }

      oxc.run(editorValue.value, rawOptions);
      semanticSource.value = editorValue.value;
      // Reset error if successful
      error.value = undefined;
    } catch (caughtError) {
      semanticSource.value = undefined;
      console.error(caughtError);
      error.value = errors.length ? errors : caughtError;
    }
    console.error = originalError;
    triggerRef(state);
  }
  watch([options, editorValue, activeTab, enabledLintRules, helperRuntime], run, {
    deep: true,
    immediate: true,
  });

  // The baseline depends on the source and parser, not the output's transform options.
  watch(
    [editorValue, () => options.value.parser, compareEnabled, helperRuntime],
    () => {
      baselineCode.value = "";
      baselineSourcemap.value = "";
      baselineError.value = undefined;
      if (!compareEnabled.value) return;
      baselineOxc ??= new OxcConstructor();
      const baselineOptions = {
        ...defaultOptions,
        run: {
          lint: false,
          formatter: false,
          transform: true,
          isolatedDeclarations: false,
          whitespace: false,
          mangle: false,
          mangleProps: false,
          compress: false,
          scope: false,
          symbol: false,
          cfg: false,
        },
        parser: { ...toRaw(options.value.parser) },
        transformer: {
          target: "esnext",
          helperModuleName: helperModuleName.value,
          useDefineForClassFields: true,
          experimentalDecorators: false,
          emitDecoratorMetadata: false,
          optimizeEnums: false,
          optimizeConstEnums: false,
        },
      };
      try {
        baselineOxc.run(editorValue.value, baselineOptions);
        baselineCode.value = baselineOxc.codegenText;
        baselineSourcemap.value = baselineOxc.codegenSourcemapText ?? "";
      } catch (caughtError) {
        baselineError.value =
          caughtError instanceof Error ? caughtError.message : String(caughtError);
      }
    },
    { deep: true, immediate: true },
  );

  // Sync tab and formatter panels to URL (reactive, no debounce needed)
  watchEffect(() => {
    urlParams.t = activeTab.value !== "codegen" ? activeTab.value : undefined;
    urlParams.scopingView =
      activeTab.value === "scoping" && scopingView.value === "bindings" ? "bindings" : undefined;
    const enabledPanels = Object.entries(formatterPanels)
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

  // Sync execution choices to URL (reactive, no debounce needed)
  watchEffect(() => {
    urlParams.helpers = helperRuntime.value === "esm" ? "esm" : undefined;
    urlParams.compare = compareEnabled.value ? "1" : undefined;
  });

  // Sync options to URL (debounced since options can change frequently)
  watchDebounced(
    options,
    (opts) => {
      const serialized = JSON.stringify(toRaw(opts));
      urlParams.options = serialized === defaultOptionsSerialized ? undefined : serialized;
    },
    { debounce: 1000, deep: true },
  );

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
    compilationErrors,
    semanticSource,
    baselineCode,
    baselineSourcemap,
    baselineError,
  };
});
