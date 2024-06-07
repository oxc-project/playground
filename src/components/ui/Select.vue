<script setup lang="ts">
import { ref } from "vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";

const props = defineProps<{
  title: string;
  initValue?: string;
  onChange?: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}>();

const modelValue = ref(props.initValue || props.options?.[0]?.value);
</script>

<template>
  <div class="mt-3">
    <p class="mb-1 text-lg text-[#3c3c43] dark:text-[#fffff5]/[.86]">
      {{ title }}
    </p>
    <Select v-model="modelValue" @update:modelValue="onChange">
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
