<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { createHighlighter } from "~/utils/shiki";

const props = defineProps<{
  codeframe: string;
  severityColor: string;
}>();

type Token = { content: string; htmlStyle?: Record<string, string> };
const tokens = ref<Token[][]>([]);
const lines = computed(() =>
  props.codeframe.split("\n").map((text) => {
    // Keep the compiler's gutter, annotations, and spacing intact. Only the
    // numbered source lines are JavaScript; the rest is diagnostic prose.
    const source = /^(\s*\d+\s*[|│] )(.*)$/u.exec(text);
    const gutter = source ? undefined : /^(\s*\|\s?)(.*)$/u.exec(text);
    const decoration = /^\s*(?:,-\[|`-+)/u.test(text);
    return {
      text,
      prefix: source?.[1],
      source: source?.[2],
      gutter: gutter?.[1],
      prose: gutter?.[2] ?? text,
      decoration,
      annotation: text.includes("^") || /^\s*[!x×]/u.test(text),
    };
  }),
);
const sourceLines = computed(() => lines.value.filter((line) => line.source !== undefined));
const highlightedLines = computed(() => {
  let sourceIndex = 0;
  return lines.value.map((line) => ({
    ...line,
    tokens: line.source !== undefined ? tokens.value[sourceIndex++] : undefined,
  }));
});

watchEffect(async (onCleanup) => {
  const source = sourceLines.value.map((line) => line.source).join("\n");
  tokens.value = [];
  if (!source) return;
  let stale = false;
  onCleanup(() => (stale = true));
  try {
    const highlighter = await createHighlighter();
    const result = highlighter.codeToTokens(source, {
      lang: "tsx",
      themes: { light: "oxc-light", dark: "oxc-dark" },
    });
    if (!stale) tokens.value = result.tokens;
  } catch {
    // The complete plain code frame remains available if highlighting fails.
  }
});
</script>

<template>
  <pre
    class="diagnostic-codeframe overflow-x-auto px-3 py-2 text-xs leading-relaxed"
    :class="severityColor"
    tabindex="0"
  ><template v-for="(line, i) in highlightedLines" :key="i"><template v-if="line.source !== undefined"><span class="text-muted-foreground">{{ line.prefix }}</span><template v-if="line.tokens"><span v-for="(token, j) in line.tokens" :key="j" class="diagnostic-token" :style="{ '--token-light': token.htmlStyle?.color, '--token-dark': token.htmlStyle?.['--shiki-dark'] }">{{ token.content }}</span></template><span v-else class="text-foreground">{{ line.source }}</span></template><template v-else><span v-if="line.gutter" class="text-muted-foreground">{{ line.gutter }}</span><span :class="line.annotation ? severityColor : line.decoration ? 'text-muted-foreground' : 'text-foreground'">{{ line.prose }}</span></template>{{ i < highlightedLines.length - 1 ? "\n" : "" }}</template></pre>
</template>

<style scoped>
.diagnostic-codeframe {
  border-left: 2px solid color-mix(in srgb, currentColor 30%, transparent);
}

.diagnostic-token {
  color: var(--token-light);
}

:global(.dark .diagnostic-token) {
  color: var(--token-dark);
}

.diagnostic-codeframe:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: -2px;
}
</style>
