<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { computed } from "vue";
import OutputPreview from "./OutputPreview.vue";

const { oxc } = await useOxc();
const code = computed(() => oxc.value.prettierFormattedText);
</script>

<template>
  <OutputPreview :code lang="tsx" />
</template>
