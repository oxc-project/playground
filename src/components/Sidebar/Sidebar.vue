<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { computed } from "vue";
import OutputPreview from "../Editor/Output/OutputPreview.vue";
import Logo from "../Logo/Logo.vue";
import Lint from "./Lint.vue";
import Parse from "./Parse.vue";

const { options } = await useOxc();
const rawOptions = computed(() => JSON.stringify(options.value, null, 2));
</script>

<template>
  <aside
    class="hidden pc:block w-52 h-screen overflow-x-auto px-8 box-content bg-[#f6f6f7] dark:bg-[#161618]"
  >
    <Logo />
    <div class="flex flex-col gap-6">
      <Parse />
      <Lint />
      <details>
        <summary>Raw options (dev)</summary>
        <OutputPreview :code="rawOptions" lang="json" class="text-xs" />
      </details>
    </div>
  </aside>
</template>
