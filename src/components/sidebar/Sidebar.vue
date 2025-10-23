<script setup lang="ts">
import Codegen from './Codegen.vue'
import Define from './Define.vue'
import Linter from './Linter.vue'
import Logo from './Logo.vue'
import Minifier from './Minifier.vue'
import OptionsDialog from './OptionsDialog.vue'
import Parser from './Parser.vue'
import Transformer from './Transformer.vue'
</script>

<template>
  <aside
    class="box-content hidden h-screen w-56 overflow-x-auto border-r border-[#e2e2e3]/40 from-[#fafafa] to-[#f6f6f7] bg-gradient-to-b px-6 shadow-sm lg:block dark:border-[#2e2e32]/40 dark:from-[#161618] dark:to-[#121214] dark:bg-gradient-to-b"
  >
    <Logo />
    <div class="flex flex-col gap-6 py-6">
      <Parser />
      <hr class="border-[#e2e2e3]/50 dark:border-[#2e2e32]/50" />
      <Linter />
      <hr class="border-[#e2e2e3]/50 dark:border-[#2e2e32]/50" />
      <Transformer />
      <hr class="border-[#e2e2e3]/50 dark:border-[#2e2e32]/50" />
      <Define />
      <hr class="border-[#e2e2e3]/50 dark:border-[#2e2e32]/50" />
      <Minifier />
      <hr class="border-[#e2e2e3]/50 dark:border-[#2e2e32]/50" />
      <Codegen />
      <hr class="border-[#e2e2e3]/50 dark:border-[#2e2e32]/50" />
      <OptionsDialog />
    </div>
  </aside>
</template>
