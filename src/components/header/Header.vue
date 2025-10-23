<script setup lang="ts">
import Logo from '../sidebar/Logo.vue'
import Media from './Media.vue'
import Nav from './Nav.vue'
import Switch from './Switch.vue'
</script>

<template>
  <header
    class="h-16 w-full flex justify-between border-b border-[#e2e2e3]/60 bg-white/80 px-8 shadow-sm backdrop-blur-xl dark:border-[#2e2e32]/60 dark:bg-[#1b1b1f]/80"
  >
    <Logo class="visible lg:invisible" />
    <div class="hidden items-center md:flex">
      <Nav />
      <Switch />
      <Media />
    </div>
  </header>
</template>
