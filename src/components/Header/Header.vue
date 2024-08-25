<script setup lang="ts">
import Logo from "../Logo/Logo.vue";
import Media from "./Media.vue";
import Nav from "./Nav.vue";
import Switch from "./Switch.vue";
</script>

<template>
  <header
    class="flex w-full h-16 border-b border-[#e2e2e3] dark:border-[#2e2e32] justify-between px-8"
  >
    <Logo class="visible pc:invisible" />
    <div class="hidden md:flex">
      <Nav />
      <Switch />
      <Media />
    </div>
  </header>
</template>
