<script setup lang="ts">
import { Checkbox } from '~/ui/checkbox'
import { cn } from '~/utils/cn'

defineProps<{
  label: string
  modelValue?: boolean
  disabled?: boolean
  defaultChecked?: boolean
  labelClass?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label flex items-center gap2>
    <Checkbox
      :checked="modelValue"
      :disabled="disabled"
      :default-checked="defaultChecked"
      @update:checked="$emit('update:modelValue', $event)"
    />
    <span :class="cn('text-sm text-secondary-foreground', labelClass)">
      {{ label }}
    </span>
  </label>
</template>
