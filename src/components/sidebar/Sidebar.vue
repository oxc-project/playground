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
    class="box-content hidden h-screen w-52 overflow-x-auto bg-white/95 backdrop-blur-md px-6 py-4 lg:block shadow-lg border-r border-gray-200/80 dark:bg-gray-900/95 dark:border-gray-700/80"
  >
    <Logo />
    <div class="flex flex-col gap-4 mt-4">
      <Parse />
      <hr class="border-gray-200 dark:border-gray-700" />
      <Linter />
      <hr class="border-gray-200 dark:border-gray-700" />
      <Transformer />
      <hr class="border-gray-200 dark:border-gray-700" />
      <Minifier />
      <!-- <Prettier /> -->
      <hr class="border-gray-200 dark:border-gray-700" />
      <Codegen />
      <hr class="border-gray-200 dark:border-gray-700" />
      <OptionsDialog />
    </div>
  </aside>
</template>
