<script setup lang="ts">
import Logo from '../sidebar/Logo.vue'
import Media from './Media.vue'
import Nav from './Nav.vue'
import Switch from './Switch.vue'
</script>

<template>
  <header
    class="sticky top-0 z-50 h-16 w-full flex items-center justify-between border-b border-[#e2e2e3]/60 bg-white/80 px-4 shadow-sm backdrop-blur-xl dark:border-[#2e2e32]/60 dark:bg-[#1b1b1f]/80 md:px-8"
  >
    <Logo class="visible lg:invisible" />
    <div class="flex items-center gap-2 md:hidden">
      <Switch />
    </div>
    <div class="hidden items-center md:flex">
      <Nav />
      <Switch />
      <Media />
    </div>
  </header>
</template>
