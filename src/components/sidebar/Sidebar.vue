<script setup lang="ts">
import Codegen from './Codegen.vue'
import Linter from './Linter.vue'
import Logo from './Logo.vue'
import Minifier from './Minifier.vue'
import OptionsDialog from './OptionsDialog.vue'
import Parse from './Parse.vue'
// import Prettier from './Prettier.vue'
import Transformer from './Transformer.vue'
</script>

<template>
  <aside
    class="box-content hidden h-screen w-52 overflow-x-auto bg-[#f6f6f7] backdrop-blur-md px-6 py-4 lg:block shadow-lg border-r dark:bg-[#161618]"
  >
    <Logo />
    <div class="flex flex-col gap-4 mt-4">
      <Parse />
      <hr />
      <Linter />
      <hr />
      <Transformer />
      <hr />
      <Minifier />
      <!-- <Prettier /> -->
      <hr />
      <Codegen />
      <hr />
      <OptionsDialog />
    </div>
  </aside>
</template>
