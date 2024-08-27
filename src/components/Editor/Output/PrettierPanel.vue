<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import OutputPreview from "./OutputPreview.vue";

const { oxc } = await useOxc();
</script>

<template>
  <OutputPreview :code="oxc.prettierIrText" lang="tsx" />
</template>
