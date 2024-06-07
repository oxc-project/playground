<script setup lang="ts">
import { useSyntaxOptionState } from "src/composable/useSyntaxOptions";
import Editor from "src/components/Editor/Editor.vue";
import Header from "src/components/Header/Header.vue";
import Sidebar from "src/components/Sidebar/Sidebar.vue";

const syntaxState = useSyntaxOptionState();
</script>

<template>
  <Suspense>
    <main class="flex w-screen h-screen bg-white dark:bg-[#1b1b1f]">
      <Sidebar :syntaxState="syntaxState" />
      <div class="flex flex-col w-screen">
        <Header />
        <div class="flex w-full h-full">
          <Editor :syntaxState="syntaxState" />
        </div>
      </div>
    </main>

    <template #fallback>
      <!-- Todo: add fallback loading -->
    </template>
  </Suspense>
</template>
