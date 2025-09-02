<script setup lang="ts">
import Codegen from './Codegen.vue'
import Linter from './Linter.vue'
import Logo from './Logo.vue'
import Minifier from './Minifier.vue'
import OptionsDialog from './OptionsDialog.vue'
import Parser from './Parser.vue'
import Transformer from './Transformer.vue'
</script>

<template>
  <aside
    class="box-content hidden h-screen w-52 overflow-x-auto bg-[#f6f6f7] px-8 lg:block dark:bg-[#161618]"
  >
    <Logo />
    <div class="flex flex-col gap-4">
      <Parser />
      <hr />
      <Linter />
      <hr />
      <Transformer />
      <hr />
      <Minifier />
      <hr />
      <Codegen />
      <hr />
      <OptionsDialog />
    </div>
  </aside>
</template>
