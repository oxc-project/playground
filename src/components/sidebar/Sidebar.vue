<script setup lang="ts">
import Codegen from "./Codegen.vue";
import Define from "./Define.vue";
import Linter from "./Linter.vue";
import Logo from "./Logo.vue";
import Minifier from "./Minifier.vue";
import OptionsDialog from "./OptionsDialog.vue";
import Parser from "./Parser.vue";
import Transformer from "./Transformer.vue";
</script>

<template>
  <aside
    class="box-content hidden h-screen w-52 overflow-x-hidden overflow-y-auto bg-[#f6f6f7] px-6 lg:block dark:bg-[#161618]"
    aria-label="Sidebar navigation"
  >
    <Logo />
    <nav class="flex flex-col gap-6 py-6" aria-label="Oxc configuration options">
      <Parser />
      <hr class="border-[#e2e2e3] dark:border-[#2e2e32]" />
      <Linter />
      <hr class="border-[#e2e2e3] dark:border-[#2e2e32]" />
      <Transformer />
      <hr class="border-[#e2e2e3] dark:border-[#2e2e32]" />
      <Define />
      <hr class="border-[#e2e2e3] dark:border-[#2e2e32]" />
      <Minifier />
      <hr class="border-[#e2e2e3] dark:border-[#2e2e32]" />
      <Codegen />
      <hr class="border-[#e2e2e3] dark:border-[#2e2e32]" />
      <OptionsDialog />
    </nav>
  </aside>
</template>
