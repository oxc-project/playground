<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { dark } from "~/composables/state";
</script>

<template>
  <button
    type="button"
    class="theme-toggle flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="dark = !dark"
  >
    <Icon :key="String(dark)" :icon="dark ? 'ri:moon-line' : 'ri:sun-line'" class="h-4 w-4" />
  </button>
</template>
