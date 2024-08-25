<script setup lang="ts">
import { syntaxOptionState } from "src/composables/state";
import Code from "./Code.vue";
import Output from "./OutputPanel.vue";
</script>

<template>
  <Code :language="syntaxOptionState.language" />
  <div class="w-px h-full border-b bg-[#e2e2e3] dark:bg-[#2e2e32]" />
  <div class="w-1/2 h-full">
    <Output />
  </div>
</template>
