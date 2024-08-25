<script setup lang="ts">
import { useSyntaxOptionState } from "src/composables/useSyntaxOptions";
import Editor from "src/components/Editor/Editor.vue";
import Header from "src/components/Header/Header.vue";
import Sidebar from "src/components/Sidebar/Sidebar.vue";

const syntaxState = useSyntaxOptionState();
</script>

<template>
  <Suspense>
    <div class="flex w-screen h-screen bg-white dark:bg-[#1b1b1f]">
      <Sidebar :syntaxState="syntaxState" />
      <div class="flex flex-col flex-1 min-w-0">
        <Header />
        <main class="flex w-full h-[calc(100%-4rem)]">
          <Editor :syntaxState="syntaxState" />
        </main>
      </div>
    </div>

    <template #fallback>
      <!-- Todo: add fallback loading -->
    </template>
  </Suspense>
</template>
