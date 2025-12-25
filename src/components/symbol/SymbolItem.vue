<script setup lang="ts">
import { computed } from 'vue'
import { outputHoverRange } from '~/composables/state'
import { getRange } from '~/utils/range'
import { useHighlightColor } from '~/utils/shiki'
import SymbolItemValue from './SymbolItemValue.vue'

const props = defineProps<{
  value?: any
}>()

const name = computed(() => props.value.name)
const nameColor = useHighlightColor(name)

function handleMouseOver(event: MouseEvent) {
  if (props.value.span) {
    const range = getRange(props.value.span)
    if (!range) return

    event.stopPropagation()
    outputHoverRange.value = range
  }
}
function handleMouseLeave() {
  outputHoverRange.value = undefined
}
</script>

<template>
  <div relative w-fit @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
    <span v-if="name">
      <span :style="{ color: nameColor }" v-text="name" />
      <span op50> (id: {{ value.symbol_id }})</span>
      <span op70>:&nbsp;</span>
    </span>
    <span>
      <span op70>{</span>
      <div v-for="(val, k) in value" :key="k" pl4>
        <SymbolItemValue :id="k" :value="val" />
      </div>
      <span op70>}</span>
    </span>
  </div>
</template>
