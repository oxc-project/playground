import { createGlobalState, useUrlSearchParams, watchDebounced } from "@vueuse/core";
import { computed, ref, shallowRef, toRaw, triggerRef, watch, watchEffect } from "vue";
import { activeTab, editorValue, formatterPanels } from "~/composables/state";
import { PLAYGROUND_DEMO_CODE } from "~/utils/constants";
import { LINT_PLUGINS, getRequiredPlugins } from "~/utils/linter-rules";
import type { Oxc, OxcOptions } from "oxc-playground";

// Sync URL state with reactive state using VueUse
// All state is stored in query params: ?t=tab&formatterPanels=...&code=...&lintRules=...
const urlParams = useUrlSearchParams<{
  t?: string;
  formatterPanels?: string;
  options?: string;
  code?: string;
  lintRules?: string;
}>("history", { removeFalsyValues: true });

// Initialize state from URL (runs synchronously at module load)
if (urlParams.t) {
  activeTab.value = urlParams.t;
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

interface LinterConfig {
  rules?: Record<string, string | number | unknown[]>;
  categories?: Record<string, string>;
  plugins?: string[];
}

type PlaygroundOptions = Omit<Required<OxcOptions>, "linter"> & {
  linter: { config?: LinterConfig };
};

export const defaultOptions: PlaygroundOptions = {
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
};

const defaultOptionsSerialized = JSON.stringify(defaultOptions);

export const useOxc = createGlobalState(async () => {
  // Start from the defaults and overlay any saved options, so fields missing
  // from an older URL (e.g. a transformer without `optimizeEnums`) keep their
  // default instead of being dropped — the WASM binding rejects missing fields.
  const options = ref<PlaygroundOptions>(structuredClone(defaultOptions));
  if (urlParams.options) {
    const saved = JSON.parse(urlParams.options);
    for (const [section, values] of Object.entries(options.value)) {
      Object.assign(values, saved[section]);
    }
    // Older links stored the config as the string expected by the WASM binding.
    if (typeof options.value.linter.config === "string") {
      options.value.linter.config = JSON.parse(options.value.linter.config);
    }
  }

  // Track configs created by the sidebar so clearing its selection restores
  // default linting without discarding a config supplied in Advanced options.
  let sidebarConfig: LinterConfig | undefined;
  const enabledLintRules = computed({
    get: () => Object.keys(options.value.linter.config?.rules ?? {}),
    set: (rules: string[]) => {
      const ownsConfig = options.value.linter.config === sidebarConfig;
      if (rules.length === 0 && ownsConfig) {
        delete options.value.linter.config;
        sidebarConfig = undefined;
        return;
      }
      const config = options.value.linter.config ?? { categories: { correctness: "off" } };
      const requiredPlugins = getRequiredPlugins(rules);
      const defaultPlugins = LINT_PLUGINS.filter((p) => p.isDefault).map((p) => p.id);
      options.value.linter.config = {
        ...config,
        rules: Object.fromEntries(rules.map((rule) => [rule, config.rules?.[rule] ?? "error"])),
        ...(requiredPlugins.length > 0 && {
          plugins: [...new Set([...(config.plugins ?? defaultPlugins), ...requiredPlugins])],
        }),
      };
      if (ownsConfig) sidebarConfig = options.value.linter.config;
    },
  });

  // Restore rule-only links; saved config takes precedence so its options survive.
  if (!options.value.linter.config?.rules && urlParams.lintRules) {
    enabledLintRules.value = urlParams.lintRules.split(",").filter(Boolean);
  }

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

      oxc.run(editorValue.value, {
        ...rawOptions,
        linter: { config: JSON.stringify(rawOptions.linter.config) },
      });
      // Reset error if successful
      error.value = undefined;
    } catch (caughtError) {
      console.error(caughtError);
      error.value = errors.length ? errors : caughtError;
    }
    console.error = originalError;
    triggerRef(state);
  }
  watch([options, editorValue, activeTab], run, { deep: true, immediate: true });

  // Sync tab and formatter panels to URL (reactive, no debounce needed)
  watchEffect(() => {
    urlParams.t = activeTab.value !== "codegen" ? activeTab.value : undefined;
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
    enabledLintRules,
    monacoLanguage,
  };
});
