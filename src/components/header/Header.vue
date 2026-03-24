<script setup lang="ts">
import Logo from "../sidebar/Logo.vue";
import Media from "./Media.vue";
import Nav from "./Nav.vue";
import Switch from "./Switch.vue";
</script>

<template>
  <header class="h-16 w-full flex items-center justify-between border-b border-border px-8">
    <Logo class="visible lg:invisible" />
    <div class="hidden md:flex">
      <Nav />
      <Switch />
      <Media />
    </div>
  </header>
</template>
