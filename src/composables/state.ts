import { useDark } from "@vueuse/core";
import { reactive, ref } from "vue";
import type { Range } from "~/utils/range";

export const dark = useDark();
export const editorValue = ref("");

export const editorCursor = ref(0);
export const autoFocus = ref(true);
export const outputHoverRange = ref<Range>();

// Active tab state for output panel
export const activeTab = ref("codegen");

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
