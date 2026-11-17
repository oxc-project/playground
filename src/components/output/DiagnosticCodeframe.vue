<script setup lang="ts">
import { computed } from "vue";
import { alignDiagnosticSource, type DiagnosticToken } from "~/utils/diagnostic-codeframe";

const props = defineProps<{
  codeframe: string;
  tokens: DiagnosticToken[][];
  severityColor: string;
}>();

const lines = computed(() =>
  props.codeframe.split("\n").map((text) => {
    // Keep the compiler's gutter, annotations, and spacing intact. Only the
    // numbered source lines are JavaScript; the rest is diagnostic prose.
    const source = /^(\s*(\d+)\s*[|│] )(.*)$/u.exec(text);
    const gutter = source ? undefined : /^(\s*\|\s?)(.*)$/u.exec(text);
    const decoration = /^\s*(?:,-\[|`-+)/u.test(text);
    return {
      text,
      prefix: source?.[1],
      source: source?.[3],
      lineNumber: source ? Number(source[2]) : undefined,
      gutter: gutter?.[1],
      prose: gutter?.[2] ?? text,
      decoration,
      annotation: text.includes("^") || /^\s*[!x×]/u.test(text),
    };
  }),
);
const highlightedLines = computed(() =>
  lines.value.map((line) => {
    const sourceTokens = line.lineNumber && props.tokens[line.lineNumber - 1];
    const aligned =
      sourceTokens && line.source !== undefined
        ? alignDiagnosticSource(line.source, sourceTokens)
        : undefined;
    return {
      ...line,
      prefix: (line.prefix ?? "") + (aligned?.gutter ?? ""),
      tokens: aligned?.tokens,
    };
  }),
);
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
