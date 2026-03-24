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
    class="box-content hidden h-screen w-52 overflow-x-hidden overflow-y-auto bg-sidebar px-6 lg:block"
    aria-label="Sidebar navigation"
  >
    <Logo />
    <nav class="flex flex-col gap-6 py-6" aria-label="Oxc configuration options">
      <Parser />
      <hr class="border-divider" />
      <Linter />
      <hr class="border-divider" />
      <Transformer />
      <hr class="border-divider" />
      <Define />
      <hr class="border-divider" />
      <Minifier />
      <hr class="border-divider" />
      <Codegen />
      <hr class="border-divider" />
      <OptionsDialog />
    </nav>
  </aside>
</template>
