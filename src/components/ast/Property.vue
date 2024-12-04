<script setup lang="ts">
import { autoFocus, outputHoverRange } from 'src/composables/state'
import { checkRange, getRange } from 'src/utils/range'
import { useHighlightColor } from 'src/utils/shiki'
import { computed, ref, watch } from 'vue'
import AstSummaryValue from './SummaryValue.vue'
import AstValue from './Value.vue'

const props = defineProps<{
  id?: string | number
  value?: any
  root?: boolean
  open?: boolean
}>()

const title = computed(() => {
  if (props.value && typeof props.value === 'object' && 'type' in props.value) {
    return props.value.type
  }
  return undefined
})
const titleColor = useHighlightColor(() => `${title.value}()`)

const openable = computed(
  () =>
    typeof props.value === 'object' &&
    props.value != null &&
    Object.keys(props.value).length > 0,
)

const isHovering = computed(() => {
  // children of csstree is iterable but not array
  if (Array.isArray(props.value)) {
    return Array.from(props.value).some((v) => checkRange(getRange(v)))
  }
  return checkRange(getRange(props.value))
})

const openManual = ref<boolean>()
const open = computed(
  () =>
    openable.value &&
    (openManual.value ?? (props.open || (autoFocus.value && isHovering.value))),
)

const valueCreated = ref(false)
watch(open, () => (valueCreated.value ||= open.value), { immediate: true })

function toggleOpen() {
  if (!openable.value) return

  if (
    openManual.value !== undefined &&
    openManual.value !== (props.open || isHovering.value)
  ) {
    openManual.value = undefined
  } else {
    openManual.value = !open.value
  }
}

const key = computed(() => (props.id != null ? String(props.id) : undefined))
const keyColor = useHighlightColor(key)
const keyClass = computed(
  () => openable.value && 'cursor-pointer hover:underline whitespace-pre',
)

function handleMouseOver(event: MouseEvent) {
  if (props.root) {
    event.stopPropagation()
    outputHoverRange.value = undefined
  } else if (props.value) {
    const range = getRange(props.value)
    if (!range) return

    event.stopPropagation()
    outputHoverRange.value = range
  }
}

function handleMouseLeave() {
  if (props.root) {
    outputHoverRange.value = undefined
  }
}

const container = ref<HTMLDivElement>()
const exactHover = ref(false)

function handleSubHoverChange(subHovering: boolean) {
  exactHover.value = isHovering.value && !subHovering
}

watch(
  [autoFocus, exactHover, isHovering, container],
  ([autoFocus, exactHover, isHovering, container]) => {
    if (autoFocus && exactHover && isHovering && container) {
      requestAnimationFrame(() => container.scrollIntoView({ block: 'center' }))
    }
  },
  { immediate: true },
)

defineExpose({ isHovering })
</script>

<template>
  <div
    ref="container"
    relative
    :class="isHovering && exactHover && 'ast-highlight'"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <span
      v-if="openable"
      left="-3.5"
      :text="open ? 'red-400' : 'green-400'"
      absolute
      select-none
      font-semibold
      op70
      >{{ open ? '-' : '+' }}</span
    >
    <span v-if="key">
      <span
        :class="keyClass"
        :style="{ color: keyColor }"
        @click="toggleOpen"
        v-text="key"
      />
      <span op70>:&nbsp;</span>
    </span>
    <span v-if="title">
      <span
        :class="keyClass"
        :style="{ color: titleColor }"
        @click="toggleOpen"
        v-text="title"
      />&nbsp;</span
    >
    <span v-if="!openable || valueCreated" v-show="!openable || open">
      <AstValue :data="value" @update:hover="handleSubHoverChange" />
    </span>
    <AstSummaryValue
      v-if="openable && !open"
      :data="value"
      @toggle="toggleOpen"
    />
  </div>
</template>
