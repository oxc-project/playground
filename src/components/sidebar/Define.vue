<script setup lang="ts">
import { ref, watch } from "vue";
import { useOxc } from "~/composables/oxc";
import { Input } from "~/ui/input";

const { options } = await useOxc();

const leftValue = ref("");
const rightValue = ref("");

watch([leftValue, rightValue], () => {
  const left = leftValue.value;
  const right = rightValue.value;
  if (left && right) {
    options.value.define.define[left] = right;
  }
  if (!left || !right) {
    delete options.value.define.define[left];
  }
});
</script>

<template>
  <section class="flex flex-col gap-3" aria-labelledby="define-heading">
    <h2 id="define-heading" class="text-base font-medium">Define Plugin</h2>

    <div class="flex gap-2" role="group" aria-label="Define key-value pair">
      <Input
        v-model="leftValue"
        class="h-8 flex-1 p-1"
        placeholder="Key"
        aria-label="Define key"
      />
      <Input
        v-model="rightValue"
        class="h-8 flex-1 p-1"
        placeholder="Value"
        aria-label="Define value"
      />
    </div>
  </section>
</template>
