import { useDark } from "@vueuse/core";
import { reactive, ref } from "vue";
import type { Range } from "~/utils/range";
import type { IRange } from "monaco-editor";

export const dark = useDark();
export const editorValue = ref("");

export const editorCursor = ref(0);
export const autoFocus = ref(true);
// Semantic byte spans are mapped to positions so highlights also survive
// Monaco's BOM and line-ending handling. Existing AST offset ranges still work.
export const outputHoverRange = ref<Range | IRange>();

// Active tab state for output panel
export const activeTab = ref("codegen");
export const scopingView = ref<"scopes" | "bindings">("scopes");

// Formatter panel checkbox states
export const formatterPanels = reactive({
  output: true,
  ir: false,
  prettier: false,
  prettierDoc: false,
});

// Enabled lint rules
export const enabledLintRules = ref<string[]>([]);

// Where generated code imports runtime helpers from: the npm package default,
// or versioned esm.sh URLs that a browser module can load directly.
export const helperRuntime = ref<"npm" | "esm">("npm");

export const compareEnabled = ref(false);

// Undefined means no expectation yet; an empty string is a valid expectation.
export const expectedOutput = ref<string>();
export const expectedDiffEnabled = ref(false);
