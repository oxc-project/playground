<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{ label: string }>();
</script>

<template>
  <details class="settings-disclosure">
    <summary>
      <span>{{ label }}</span>
      <Icon icon="ri:arrow-right-s-line" class="settings-chevron h-4 w-4" />
    </summary>
    <div class="settings-detail-content">
      <slot />
    </div>
  </details>
</template>
