<script setup lang="ts">
import { useOxc } from "src/composable/useOxc";

const { oxc } = useOxc();
</script>

<template>
  <div class="overflow-y-scroll h-full max-h-full">
    <pre>{{ oxc.ast }}</pre>
  </div>
</template>
