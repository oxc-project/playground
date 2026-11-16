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
  <section class="settings-section" aria-labelledby="define-heading">
    <h3 id="define-heading">Define Plugin</h3>
    <div class="grid min-w-0 grid-cols-2 gap-2" role="group" aria-label="Define key-value pair">
      <label class="settings-field-stacked min-w-0">
        <span>Identifier</span>
        <Input
          v-model="leftValue"
          class="min-w-0 font-mono"
          placeholder="DEBUG"
          aria-label="Define key"
        />
      </label>
      <label class="settings-field-stacked min-w-0">
        <span>Replacement</span>
        <Input
          v-model="rightValue"
          class="min-w-0 font-mono"
          placeholder="false"
          aria-label="Define value"
        />
      </label>
    </div>
  </section>
</template>
