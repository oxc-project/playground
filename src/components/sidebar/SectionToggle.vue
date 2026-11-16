<script setup lang="ts">
import { useId } from "vue";
import { Checkbox } from "~/ui/checkbox";

withDefaults(
  defineProps<{
    label: string;
    headingId?: string;
    as?: "h2" | "h3";
  }>(),
  { as: "h3" },
);

const checked = defineModel<boolean | undefined>({ required: true });
const checkboxId = useId();
</script>

<template>
  <component :is="as" :id="headingId" class="settings-toggle-row">
    <label :for="checkboxId">
      {{ label }}
      <Checkbox :id="checkboxId" v-model:checked="checked" />
    </label>
  </component>
</template>
