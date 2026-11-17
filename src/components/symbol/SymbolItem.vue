<script setup lang="ts">
import { computed } from "vue";
import SourceRangeButton from "~/components/SourceRangeButton.vue";
import { useSourceRange } from "~/composables/source-navigation";
import { outputHoverRange } from "~/composables/state";
import { useHighlightColor } from "~/utils/shiki";
import SymbolItemValue from "./SymbolItemValue.vue";

const props = defineProps<{
  value?: any;
}>();

const name = computed(() => props.value.name);
const nameColor = useHighlightColor(name);
const sourceRange = useSourceRange(() => props.value.span, "utf8");

function handleMouseOver(event: MouseEvent) {
  event.stopPropagation();
  outputHoverRange.value = sourceRange.value?.offsets;
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
    <SourceRangeButton :range="sourceRange?.positions" :label="`symbol ${name}`" />
    <span>
      <span class="opacity-70">{</span>
      <div v-for="(val, k) in value" :key="k" class="pl-4">
        <SymbolItemValue :id="k" :value="val" />
      </div>
      <span class="opacity-70">}</span>
    </span>
  </div>
</template>
