<script setup lang="ts">
import { Label } from "src/ui/label";
import { RadioGroup, RadioGroupItem } from "src/ui/radio-group";

const radios = [
  { value: "ast", label: "Ast" },
  { value: "codegen", label: "Codegen" },
  { value: "ir", label: "IR" },
  { value: "prettier", label: "Prettier" },
  { value: "format", label: "Format(Prettier)" },
  { value: "scope", label: "Scope" },
  { value: "symbol", label: "Symbol" },
];
</script>

<template>
  <div
    class="flex relative items-center px-2 py-3 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-px before:bg-no-repeat before:bg-[#e2e2e3] dark:before:bg-[#2e2e32]"
  >
    <RadioGroup class="flex" default-value="ast">
      <div v-for="radio in radios">
        <RadioGroupItem
          :id="radio.value"
          :value="radio.value"
          class="peer w-0 h-0 border-0"
          style="clip: rect(0, 0, 0, 0)"
        />
        <Label
          :for="radio.value"
          class="px-3 py-2 bg-white dark:bg-[#2e2e32] border-2 rounded-md text-sm hover:border-[#3451b2] dark:hover:border-[#a8b1ff] peer-data-[state=checked]:bg-[#3451b2] dark:peer-data-[state=checked]:bg-[#a8b1ff] peer-data-[state=checked]:border-[#3451b2] dark:peer-data-[state=checked]:border-[#a8b1ff] peer-data-[state=checked]:text-white"
        >
          {{ radio.label }}
        </Label>
      </div>
    </RadioGroup>
  </div>
</template>
