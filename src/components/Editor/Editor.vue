<script setup lang="ts">
import { syntaxOptionState } from "src/composables/state";
import Code from "./Code.vue";
import Output from "./OutputPanel.vue";
</script>

<template>
  <main class="flex flex-1 flex-col md:flex-row min-h-0">
    <Code :language="syntaxOptionState.language" />
    <div class="w-px h-full border-b bg-[#e2e2e3] dark:bg-[#2e2e32]" />
    <Output class="min-w-[50%]" />
  </main>
</template>
