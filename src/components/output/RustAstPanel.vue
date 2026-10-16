<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { toRef } from "vue";
import { useOxc } from "~/composables/oxc";
import OutputPreview from "./OutputPreview.vue";

const { oxc } = await useOxc();

// The Rust AST output is large and expensive to highlight, so its debounced to
// keep the editor responsive while typing
const ir = refDebounced(
  toRef(() => oxc.value.ir),
  200,
);
</script>

<template>
  <OutputPreview :code="ir" lang="tsx" />
</template>
