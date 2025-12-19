<script setup lang="ts" generic="T extends string">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";

defineProps<{
  modelValue?: string;
  defaultValue?: T;
  options: {
    value: T;
    label: string;
  }[];
}>();
defineEmits<{
  "update:modelValue": [value: T];
}>();
</script>

<template>
  <Select
    :model-value="modelValue"
    :default-value="defaultValue as string"
    @update:model-value="$emit('update:modelValue', $event as T)"
  >
    <SelectTrigger class="p-2">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
