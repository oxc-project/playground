<script setup lang="ts" generic="T extends string">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/ui/select'

defineProps<{
  title: string
  modelValue?: string
  defaultValue?: T
  options: {
    value: T
    label: string
  }[]
}>()
defineEmits<{
  'update:modelValue': [value: T]
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]">
      {{ title }}
    </p>
    <Select
      :model-value="modelValue"
      :default-value="defaultValue as string"
      @update:model-value="$emit('update:modelValue', $event as T)"
    >
      <SelectTrigger
        class="w-[180px] bg-white dark:bg-[#1b1b1f] focus:ring-offset-0 focus:outline-none focus:ring-0"
      >
        <SelectValue class="text-[#3c3c43] dark:text-[#fffff5]/[.86]" />
      </SelectTrigger>
      <SelectContent class="bg-white dark:bg-[#1b1b1f]">
        <SelectGroup>
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="text-[#3c3c43] dark:text-[#fffff5]/[.86]"
          >
            {{ option.label }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
