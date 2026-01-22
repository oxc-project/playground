<script setup lang="ts">
import { computed } from "vue";
import { outputHoverRange } from "~/composables/state";
import { getRange } from "~/utils/range";
import { useHighlightColor } from "~/utils/shiki";
import SymbolItemValue from "./SymbolItemValue.vue";

const props = defineProps<{
  value?: any;
}>();

const name = computed(() => props.value.name);
const nameColor = useHighlightColor(name);

function handleMouseOver(event: MouseEvent) {
  if (props.value.span) {
    const range = getRange(props.value.span);
    if (!range) return;

    event.stopPropagation();
    outputHoverRange.value = range;
  }
}
function handleMouseLeave() {
  outputHoverRange.value = undefined;
}
</script>

<template>
  <div class="relative w-fit" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
    <span v-if="name">
      <span :style="{ color: nameColor }" v-text="name" />
      <span class="opacity-50"> (id: {{ value.symbol_id }})</span>
      <span class="opacity-70">:&nbsp;</span>
    </span>
    <span>
      <span class="opacity-70">{</span>
      <div v-for="(val, k) in value" :key="k" class="pl-4">
        <SymbolItemValue :id="k" :value="val" />
      </div>
      <span class="opacity-70">}</span>
    </span>
  </div>
</template>
