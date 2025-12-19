import { createGlobalState, watchDebounced } from "@vueuse/core";
import { computed, ref, shallowRef, toRaw, triggerRef, watch } from "vue";
import { activeTab, editorValue } from "~/composables/state";
import { PLAYGROUND_DEMO_CODE } from "~/utils/constants";
import { atou, utoa } from "~/utils/url";
import type { Oxc, OxcOptions } from "oxc-playground";

async function initialize(): Promise<Oxc> {
  const { Oxc } = await import("oxc-playground");
  return new Oxc();
}

export const loadingOxc = ref(true);
export const oxcPromise = initialize().finally(
  () => (loadingOxc.value = false),
);

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
    formatter: {
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
    },
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
    } catch (error_) {
      console.error(error_);
      error.value = errors.length ? errors : error_;
    }
    console.error = originalError;
    triggerRef(state);
  }
  watch([options, editorValue, activeTab], run, { deep: true });

  let rawUrlState: string | undefined;
  let urlState: any;
  try {
    rawUrlState = atou(location.hash!.slice(1));
    urlState = rawUrlState && JSON.parse(rawUrlState);
  } catch (error) {
    console.error(error);
  }

  if (urlState?.o) {
    options.value = urlState.o;
  }

  if (urlState?.t) {
    activeTab.value = urlState.t;
  }

  editorValue.value = urlState?.c ?? PLAYGROUND_DEMO_CODE;

  watchDebounced(
    () => [editorValue.value, options.value, activeTab.value],
    ([editorValue, options, activeTab]) => {
      const serialized = JSON.stringify({
        c: editorValue === PLAYGROUND_DEMO_CODE ? "" : editorValue,
        o: options,
        t: activeTab,
      });

      try {
        history.replaceState({}, "", `#${utoa(serialized)}`);
      } catch (error) {
        console.error(error);
      }
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
