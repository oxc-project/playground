<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { inject } from "vue";
import { sourceNavigationKey } from "~/composables/source-navigation";
import type { IRange } from "monaco-editor";

defineProps<{
  range?: IRange;
  label: string;
}>();

const navigate = inject(sourceNavigationKey);
</script>

<template>
  <button
    v-if="range && navigate"
    type="button"
    class="ml-1 inline-flex h-5 w-5 select-none items-center justify-center rounded align-middle text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    :aria-label="`Go to source for ${label}`"
    :title="`Go to source for ${label}`"
    @click.stop="navigate(range)"
  >
    <Icon icon="ri:focus-3-line" class="h-3.5 w-3.5" aria-hidden="true" />
  </button>
</template>
