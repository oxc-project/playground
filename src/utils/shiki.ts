import { useMemoize } from "@vueuse/core";
import { computed, ref, toValue, watchEffect, type MaybeRefOrGetter } from "vue";
import { dark } from "~/composables/state";
import type { HighlighterCore } from "shiki/core";

// Global HTML highlighter instance - loaded lazily.
let highlighterPromise: Promise<HighlighterCore> | undefined;
const isLoading = ref(false);
const isLoaded = ref(false);

export async function createHighlighterInstance(): Promise<HighlighterCore> {
  const [
    { createHighlighterCore },
    { createJavaScriptRegexEngine },
    { highlightThemes },
    langJson,
    langRust,
    langTsx,
  ] = await Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
    import("./highlight-themes"),
    import("shiki/langs/json.mjs"),
    import("shiki/langs/rust.mjs"),
    import("shiki/langs/tsx.mjs"),
  ]);

  return createHighlighterCore({
    themes: highlightThemes,
    langs: [langJson.default, langRust.default, langTsx.default],
    // Keep Monaco's JS/TS language services while highlighting JSX and TSX
    // with the same grammar used by the generated-code preview.
    langAlias: { javascript: "tsx", typescript: "tsx" },
    engine: createJavaScriptRegexEngine(),
  });
}

export function createHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    isLoading.value = true;
    highlighterPromise = createHighlighterInstance()
      .then((highlighter) => {
        isLoaded.value = true;
        return highlighter;
      })
      .catch((error) => {
        highlighterPromise = undefined;
        throw error;
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
  return highlighterPromise;
}

// Export reactive state for components to check loading status
export const shikiLoading = computed(() => isLoading.value);
export const shikiLoaded = computed(() => isLoaded.value);

export type ShikiLang = "json" | "rust" | "tsx" | "text" | "typescript";

export async function highlight(code: string, lang: ShikiLang): Promise<string> {
  try {
    const highlighter = await createHighlighter();
    return highlighter.codeToHtml(code, {
      lang,
      themes: { light: "oxc-light", dark: "oxc-dark" },
      transformers: [
        {
          name: "add-style",
          pre(node) {
            this.addClassToHast(node, "!bg-transparent p-2");
          },
        },
      ],
    });
  } catch (error) {
    console.warn("Failed to load Shiki highlighter:", error);
    // Fallback to plain text with basic styling
    return `<pre class="!bg-transparent p-2"><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

const highlightToken = useMemoize(async (code: string, theme: string) => {
  try {
    const highlighter = await createHighlighter();
    return highlighter.codeToTokens(code, {
      lang: "typescript",
      theme,
    });
  } catch {
    return { tokens: [[{ color: "#666666" }]] }; // Fallback gray color
  }
});

export function useHighlightColor(content: MaybeRefOrGetter<string | undefined>) {
  const color = ref("#666666"); // Default color

  // Reactive computation that updates color when content or theme changes
  watchEffect(async () => {
    const code = toValue(content);
    if (code == null) {
      color.value = "";
      return;
    }

    try {
      const theme = `oxc-${dark.value ? "dark" : "light"}`;
      // process the highlight after main rendering completes to prevent laggy
      await new Promise((res) => requestIdleCallback(res, { timeout: 500 }));
      const result = await highlightToken(code, theme);
      const token = result.tokens[0];
      const idx = code.startsWith('"') && token.length > 1 ? 1 : 0;
      color.value = token[idx].color || "#666666";
    } catch {
      color.value = "#666666"; // Fallback color
    }
  });

  return computed(() => color.value);
}
