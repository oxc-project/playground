<script setup lang="ts">
import Checkbox from "../ui/Checkbox.vue";

const props = defineProps(["syntaxState"]);
const emit = defineEmits(["update:syntaxState"]);

function checkedLint(checked: boolean) {
  props.syntaxState.linted = checked;
}
</script>

<template>
  <div class="pt-3">
    <p class="text-lg text-[#3c3c43] dark:text-[#fffff5]/[.86]">Lint Options</p>
    <Checkbox
      id="lint-enable"
      title="Lint Enabled"
      :checked="syntaxState.linted"
      :onChange="checkedLint"
    />
  </div>
</template>
