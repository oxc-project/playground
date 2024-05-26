<script setup lang="ts">
import Logo from "../Logo/Logo.vue";
import Lint from "./Lint.vue";
import Syntax from "./Syntax.vue";
</script>

<template>
  <div
    class="hidden pc:block w-52 h-screen px-8 box-content bg-[#f6f6f7] dark:bg-[#161618]"
  >
    <Logo />
    <Syntax />
    <Lint />
  </div>
</template>
