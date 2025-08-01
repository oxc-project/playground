<script setup lang="ts">
import Logo from '../sidebar/Logo.vue'
import Media from './Media.vue'
import Nav from './Nav.vue'
import Switch from './Switch.vue'
</script>

<template>
  <header
    class="h-16 w-full flex justify-between border-b border-gray-200/80 backdrop-blur-md bg-white/90 px-8 shadow-sm dark:border-gray-700/80 dark:bg-gray-900/90"
  >
    <Logo class="visible lg:invisible" />
    <div class="hidden md:flex items-center gap-2">
      <Nav />
      <Switch />
      <Media />
    </div>
  </header>
</template>
