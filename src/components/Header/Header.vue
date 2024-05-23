<script setup lang="ts">
import Logo from "../Logo/Logo.vue";
import Media from "./Media.vue";
import Nav from "./Nav.vue";
import Switch from "./Switch.vue";
</script>

<template>
  <header class="relative w-full h-16">
    <div class="flex justify-between w-full h-full px-8">
      <Logo class="visible pc:invisible" />
      <div class="hidden md:flex">
        <Nav />
        <Switch />
        <Media />
      </div>
    </div>
    <div
      class="absolute bottom-0 w-full h-px border-b border-[#e2e2e3] dark:border-[#2e2e32]"
    />
  </header>
</template>
