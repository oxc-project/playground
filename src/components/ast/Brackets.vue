<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ data: any }>();
const start = computed(() => (Array.isArray(props.data) ? "[" : "{"));
const end = computed(() => (Array.isArray(props.data) ? "]" : "}"));
</script>

<template>
  <span class="opacity-70">{{ start }}&nbsp;</span>
  <slot />
  <span class="opacity-70">&nbsp;{{ end }}</span>
</template>
