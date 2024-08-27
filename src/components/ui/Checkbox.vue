<script setup lang="ts">
import { Checkbox } from "src/ui/checkbox";

defineProps<{
  id: string;
  title: string;
  modelValue?: boolean;
  disabled?: boolean;
  defaultChecked?: boolean;
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <div class="flex items-center">
    <Checkbox
      :id="id"
      class="mr-2 bg-white dark:bg-[#1b1b1f] data-[state=checked]:bg-[#3451b2] dark:data-[state=checked]:bg-[#a8b1ff] data-[state=checked]:text-white dark:data-[state=checked]:text-[#2e2e32]"
      :checked="modelValue"
      :disabled="disabled"
      :default-checked="defaultChecked"
      @update:checked="$emit('update:modelValue', $event)"
    />
    <label class="text-sm text-[#3c3c43] dark:text-[#fffff5]/[.86]" :for="id">
      {{ title }}
    </label>
  </div>
</template>
