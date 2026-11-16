<script setup lang="ts">
const commit = import.meta.env.OXC_COMMIT || "unknown";
</script>

<template>
  <div class="flex shrink-0 items-center gap-3">
    <a
      class="flex items-center transition-opacity hover:opacity-75"
      href="https://oxc.rs"
      aria-label="Oxc homepage"
    >
      <img class="hidden h-5 dark:block" src="/oxc-light.svg" alt="Oxc logo" />
      <img class="block h-5 dark:hidden" src="/oxc-dark.svg" alt="Oxc logo" />
    </a>
    <a
      v-if="commit !== 'unknown'"
      :href="`https://github.com/oxc-project/oxc/commit/${commit}`"
      class="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground sm:block"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`View commit ${commit.slice(0, 7)}`"
    >
      {{ commit.slice(0, 7) }}
    </a>
  </div>
</template>
