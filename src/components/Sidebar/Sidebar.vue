<script setup lang="ts">
import { type SyntaxOptions } from "src/composable/useSyntaxOptions";
import Logo from "../Logo/Logo.vue";
import Lint from "./Lint.vue";
import Syntax from "./Syntax.vue";

defineProps<{ syntaxState: SyntaxOptions }>();
</script>

<template>
  <div
    class="hidden pc:block w-52 h-screen px-8 box-content bg-[#f6f6f7] dark:bg-[#161618]"
  >
    <Logo />
    <Syntax :syntaxState="syntaxState" />
    <Lint :syntaxState="syntaxState" />
  </div>
</template>
