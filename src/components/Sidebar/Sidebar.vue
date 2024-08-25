<script setup lang="ts">
import { type SyntaxOptions } from "src/composables/useSyntaxOptions";
import Logo from "../Logo/Logo.vue";
import Lint from "./Lint.vue";
import Syntax from "./Syntax.vue";

defineProps<{ syntaxState: SyntaxOptions }>();
</script>

<template>
  <aside
    class="hidden pc:block w-52 h-screen px-8 box-content bg-[#f6f6f7] dark:bg-[#161618]"
  >
    <Logo />
    <div class="flex flex-col gap-6">
      <Syntax :syntaxState="syntaxState" />
      <Lint :syntaxState="syntaxState" />
    </div>
  </aside>
</template>
