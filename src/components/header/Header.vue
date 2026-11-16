<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Logo from "../sidebar/Logo.vue";
import Media from "./Media.vue";
import Nav from "./Nav.vue";
import Switch from "./Switch.vue";

defineProps<{ settingsOpen: boolean }>();
defineEmits<{ "toggle-settings": [] }>();
</script>

<template>
  <header
    class="app-header flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-4 sm:px-6"
  >
    <div class="flex min-w-0 items-center gap-4">
      <Logo />
      <span class="h-5 w-px bg-border" aria-hidden="true" />
      <span class="text-sm font-medium tracking-tight">Playground</span>
    </div>
    <div class="flex items-center gap-3">
      <Nav class="hidden md:flex" />
      <Media />
      <Switch />
      <button
        class="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        :class="{ 'bg-accent text-primary': settingsOpen }"
        aria-label="Toggle configuration"
        title="Toggle configuration"
        aria-controls="configuration-sidebar"
        :aria-expanded="settingsOpen"
        @click="$emit('toggle-settings')"
      >
        <Icon icon="ri:equalizer-2-line" class="h-4 w-4" />
      </button>
    </div>
  </header>
</template>
