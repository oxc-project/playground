import { createGlobalState } from "@vueuse/core";
import { computed, ref, shallowRef, watch } from "vue";
import { editorValue } from "~/composables/state";
import { initGoAst, isInitialized, parseAST, type GoAstNode } from "tsgo-ast";

function extensionToLang(ext: string): "ts" | "tsx" | "js" | "jsx" {
  if (ext === "ts" || ext === "tsx" || ext === "js" || ext === "jsx") return ext;
  if (ext === "mts" || ext === "cts") return "ts";
  if (ext === "mjs" || ext === "cjs") return "js";
  return "tsx";
}

export const useGoAst = createGlobalState(() => {
  const loading = ref(false);
  const initialized = ref(false);
  const ast = shallowRef<GoAstNode | null>(null);
  const errors = ref<string[]>([]);
  const extension = ref("tsx");

  const astJson = computed(() => (ast.value ? JSON.stringify(ast.value, null, 2) : ""));

  async function init() {
    if (initialized.value || loading.value) return;
    loading.value = true;
    try {
      await initGoAst("/tsgo-ast.wasm");
      initialized.value = true;
    } catch (err) {
      console.error("Failed to initialize tsgo-ast:", err);
    } finally {
      loading.value = false;
    }
  }

  function parse() {
    if (!isInitialized()) return;
    try {
      const result = parseAST(editorValue.value, extensionToLang(extension.value));
      ast.value = result.ast;
      errors.value = result.errors ?? [];
    } catch (err) {
      console.error("tsgo-ast parse error:", err);
      ast.value = null;
      errors.value = [String(err)];
    }
  }

  watch([editorValue, extension, initialized], () => {
    if (initialized.value) parse();
  });

  return { loading, initialized, ast, astJson, errors, extension, init };
});
