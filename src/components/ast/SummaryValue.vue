<script setup lang="ts">
import { computed } from 'vue'
import AstBrackets from './Brackets.vue'

const props = defineProps<{ data: any }>()
const emit = defineEmits<{
  toggle: []
}>()

const contentSummary = computed(() => {
  if (Array.isArray(props.data)) {
    const len = props.data.length
    return `${len} element${len === 1 ? '' : 's'}`
  } else {
    const keys = Object.keys(props.data)
    const len = keys.length
    return keys.slice(0, 5).join(', ') + (len > 5 ? `, ... +${len - 5}` : '')
  }
})
</script>

<template>
  <AstBrackets :data>
    <span
      cursor-pointer
      font-italic
      op70
      hover:underline
      @click="emit('toggle')"
      v-text="contentSummary"
    />
  </AstBrackets>
</template>
