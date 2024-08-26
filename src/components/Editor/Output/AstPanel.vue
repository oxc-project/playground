<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { computed } from "vue";
import OutputPreview from "./OutputPreview.vue";

const { oxc } = await useOxc();
const code = computed(() => JSON.stringify(oxc.value.ast, undefined, 2));
</script>

<template>
  <OutputPreview :code lang="json" />
</template>
