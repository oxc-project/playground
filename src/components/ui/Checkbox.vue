<script setup lang="ts">
import { Checkbox } from "src/ui/checkbox";

defineProps<{
  id: string;
  title: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}>();
</script>

<template>
  <div class="flex items-center mt-3">
    <Checkbox
      class="mr-2 bg-white dark:bg-[#1b1b1f] data-[state=checked]:bg-[#3451b2] dark:data-[state=checked]:bg-[#a8b1ff] data-[state=checked]:text-white dark:data-[state=checked]:text-[#2e2e32]"
      :id="id"
      :defaultChecked="checked"
      :disabled="disabled"
      :onUpdate:checked="onChange"
    />
    <label class="text-[#3c3c43] dark:text-[#fffff5]/[.86]" :for="id">
      {{ title }}
    </label>
  </div>
</template>
