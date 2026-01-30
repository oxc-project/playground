<script setup lang="ts">
import Logo from "../sidebar/Logo.vue";
import Media from "./Media.vue";
import Nav from "./Nav.vue";
import Switch from "./Switch.vue";
</script>

<template>
  <header
    class="h-16 w-full flex justify-between border-b border-[#E5E4E7] px-8 dark:border-[#3B3440]"
  >
    <Logo class="visible lg:invisible" />
    <div class="hidden md:flex">
      <Nav />
      <Switch />
      <Media />
    </div>
  </header>
</template>
