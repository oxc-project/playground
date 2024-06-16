<script setup lang="ts">
import Code from "./Code.vue";
import Output from "./OutputPanel.vue";

defineProps(["syntaxState"]);
</script>

<template>
  <Code :language="syntaxState.language" />
  <div class="w-px h-full border-b bg-[#e2e2e3] dark:bg-[#2e2e32]" />
  <div class="w-1/2 h-full">
    <Output />
  </div>
</template>
