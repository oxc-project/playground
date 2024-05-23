<script setup lang="ts">
import { capitalize } from "vue";
import Checkbox from "../ui/Checkbox.vue";
import Select from "../ui/Select.vue";
</script>

<template>
  <div>
    <p
      class="pt-4 text-xl font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86]"
    >
      Options
    </p>

    <Select
      :title="capitalize('source')"
      :options="[
        { value: 'module', label: 'module' },
        { value: 'script', label: 'script' },
      ]"
    />
    <Select
      :title="capitalize('language')"
      :options="[
        { value: 'typescript', label: 'typescript' },
        { value: 'javascript', label: 'javascript' },
      ]"
    />

    <Checkbox id="jsx" title="JSX" />
    <Checkbox id="Tsx" title="TSX" />
    <Checkbox id="d.ts" title="D.TS" />
  </div>
</template>
