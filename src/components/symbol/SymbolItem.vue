<script setup lang="ts">
import { computed } from "vue";
import { outputHoverRange } from "~/composables/state";
import { getRange } from "~/utils/range";
import { useHighlightColor } from "~/utils/shiki";

const props = defineProps<{
  id?: string | number;
  value?: any;
  root?: boolean;
  isArrayItem?: boolean;
}>();

const key = computed(() => {
  if (props.id == null) return;
  // Don't show keys for array items
  if (props.isArrayItem) return;
  return String(props.id);
});
const keyColor = useHighlightColor(key);

function handleMouseOver(event: MouseEvent) {
  if (props.root) {
    event.stopPropagation();
    outputHoverRange.value = undefined;
  } else if (props.value) {
    const range = getRange(props.value);
    if (!range) return;

    event.stopPropagation();
    outputHoverRange.value = range;
  }
}

function handleMouseLeave() {
  if (props.root) {
    outputHoverRange.value = undefined;
  }
}

function isObject(value: any): boolean {
  return value && typeof value === "object" && !Array.isArray(value);
}

function isArray(value: any): boolean {
  return Array.isArray(value);
}

function isPrimitive(value: any): boolean {
  return !isObject(value) && !isArray(value);
}

function formatValue(value: any, propId?: string | number): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") {
    // Don't wrap certain fields with quotes (like flags)
    if (propId === "flags") return value;
    return `"${value}"`;
  }
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  return String(value);
}
</script>

<template>
  <div relative w-fit @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
    <span v-if="key">
      <span :style="{ color: keyColor }" v-text="key" />
      <span op70>:&nbsp;</span>
    </span>
    <span v-if="isPrimitive(value)">
      <span
        :class="typeof value === 'string' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'"
        v-text="formatValue(value, id)"
      />
    </span>
    <span v-else-if="isArray(value)">
      <span op70>[</span>
      <div v-for="(item, index) in value" :key="index" pl4>
        <SymbolItem :value="item" :is-array-item="true" />
      </div>
      <span op70>]</span>
    </span>
    <span v-else-if="isObject(value)">
      <span op70>{</span>
      <div v-for="(val, k) in value" :key="k" pl4>
        <SymbolItem :id="k" :value="val" />
      </div>
      <span op70>}</span>
    </span>
  </div>
</template>
