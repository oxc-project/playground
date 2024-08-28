<script setup lang="ts">
import Logo from '../Logo/Logo.vue'
import Lint from './Lint.vue'
import OptionsDialog from './OptionsDialog.vue'
import Parse from './Parse.vue'
import Prettier from './Prettier.vue'
</script>

<template>
  <aside
    class="box-content hidden h-screen w-52 overflow-x-auto bg-[#f6f6f7] px-8 lg:block dark:bg-[#161618]"
  >
    <Logo />
    <div class="flex flex-col gap-6">
      <Parse />
      <Lint />
      <Prettier />
      <OptionsDialog />
    </div>
  </aside>
</template>
