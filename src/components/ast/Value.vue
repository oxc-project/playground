<script setup lang="ts">
import { useTemplateRefsList } from '@vueuse/core'
import { computed, watchEffect } from 'vue'
import { useHighlightColor } from '~/utils/shiki'
import AstBrackets from './Brackets.vue'
import AstProperty from './Property.vue'

const props = defineProps<{ data: any }>()
const emit = defineEmits<{
  'update:hover': [value: boolean]
}>()

const isArrayOrObject = computed(() => {
  if (props.data === null) return false
  if (Array.isArray(props.data)) return true
  if (Object.prototype.toString.call(props.data) === '[object Object]')
    return true
  return false
})
const hasChildren = computed(
  () => isArrayOrObject.value && Object.keys(props.data).length > 0,
)

const value = computed<string | undefined>(() => {
  if (typeof props.data === 'bigint') return `${String(props.data)}n`
  if (props.data instanceof RegExp) return props.data.toString()
  return JSON.stringify(props.data)
})
const valueColor = computed(() =>
  isArrayOrObject.value ? undefined : useHighlightColor(value).value,
)

const properties = useTemplateRefsList<InstanceType<typeof AstProperty>>()
watchEffect(() => {
  const hovering = properties.value.some((p) => p.isHovering)
  emit('update:hover', hovering)
})
</script>

<template>
  <template v-if="isArrayOrObject">
    <AstBrackets :data>
      <div v-if="hasChildren" ml6>
        <template v-for="(item, key) of data" :key="key">
          <AstProperty :id="key" :ref="properties.set" :value="item" />
        </template>
      </div>
    </AstBrackets>
  </template>
  <span v-else>
    <span :style="{ color: valueColor }" whitespace-pre v-text="value" />
    <span op70>,</span>
  </span>
</template>
