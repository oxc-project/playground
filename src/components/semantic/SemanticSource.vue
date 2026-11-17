<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { inject, onBeforeUnmount } from "vue";
import { sourceNavigationKey } from "~/composables/source-navigation";
import { outputHoverRange } from "~/composables/state";
import type { createSemanticSource } from "~/utils/scoping";

const props = defineProps<{
  location: ReturnType<ReturnType<typeof createSemanticSource>["locate"]>;
  fresh: boolean;
  snippet?: boolean;
  label?: string;
}>();
const navigate = inject(sourceNavigationKey);
function highlight() {
  if (props.fresh && props.location) outputHoverRange.value = props.location.range;
}
function clear() {
  outputHoverRange.value = undefined;
}
onBeforeUnmount(clear);
</script>

<template>
  <button
    v-if="location && fresh && navigate"
    type="button"
    class="semantic-source"
    :class="{ 'semantic-snippet': snippet }"
    :title="`Go to source · ${location.start.lineNumber}:${location.start.column}${snippet ? ` · ${location.snippet}` : ''}`"
    :aria-label="`Go to source${label ? ` for ${label}` : ''} at ${location.start.lineNumber}:${location.start.column}`"
    @click.stop="navigate(location.range)"
    @mouseenter="highlight"
    @mouseleave="clear"
    @focus="highlight"
    @blur="clear"
  >
    <Icon icon="ri:crosshair-2-line" aria-hidden="true" class="shrink-0" />
    <span class="shrink-0 tabular-nums"
      >{{ location.start.lineNumber }}:{{ location.start.column }}</span
    >
    <code v-if="snippet" class="truncate">{{ location.snippet }}</code>
  </button>
  <code v-else-if="snippet && location" class="block truncate text-muted-foreground">{{
    location.snippet
  }}</code>
</template>
