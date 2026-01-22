<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import { Input } from "~/ui/input";

const { options } = await useOxc();
const showOptions = ref(false);

function toggleOptions() {
  showOptions.value = !showOptions.value;
}
</script>

<template>
  <section class="flex flex-col gap-3" aria-labelledby="parser-heading">
    <h2 id="parser-heading" class="text-base font-medium">
      Parser
    </h2>

    <label class="flex items-center gap-2 text-sm">
      <span class="text-secondary-foreground">Extension</span>
      <Input v-model="options.parser.extension" class="h-8 p-1" />
    </label>

    <button
      type="button"
      class="flex items-center gap-1 text-sm text-secondary-foreground transition-colors hover:text-foreground"
      :aria-expanded="showOptions"
      aria-controls="parser-options"
      @click="toggleOptions"
    >
      <Icon
        icon="ri:arrow-right-s-line"
        class="transition-transform duration-200"
        :class="{ 'rotate-90': showOptions }"
      />
      <span>Options</span>
    </button>

    <div
      v-if="showOptions"
      id="parser-options"
      class="flex flex-col gap-2"
      role="region"
      aria-label="Parser options"
    >
      <Checkbox
        v-model="options.parser.semanticErrors"
        label="semanticErrors"
        label-class="text-xs font-mono"
      />
      <Checkbox
        v-model="options.parser.preserveParens"
        default-checked
        label="preserveParens"
        label-class="text-xs font-mono"
      />
      <Checkbox
        v-model="options.parser.allowReturnOutsideFunction"
        label="allowReturnOutsideFunction"
        label-class="text-xs font-mono"
      />
      <Checkbox
        v-model="options.parser.allowV8Intrinsics"
        label="allowV8Intrinsics"
        label-class="text-xs font-mono"
      />
    </div>
  </section>
</template>
