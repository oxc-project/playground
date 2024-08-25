<script setup lang="ts">
import Checkbox from "../ui/Checkbox.vue";

const props = defineProps(["syntaxState"]);
const emit = defineEmits(["update:syntaxState"]);

function checkedLint(checked: boolean) {
  props.syntaxState.linted = checked;
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]">
      Lint Options
    </p>
    <Checkbox
      id="lint-enable"
      title="Enable Lint"
      :checked="syntaxState.linted"
      :onChange="checkedLint"
    />
  </div>
</template>
