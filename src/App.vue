<script setup lang="ts">
import Editor from "src/components/Editor/Editor.vue";
import Header from "src/components/Header/Header.vue";
import Sidebar from "src/components/Sidebar/Sidebar.vue";
</script>

<template>
  <Suspense>
    <div class="flex w-screen h-screen bg-white dark:bg-[#1b1b1f]">
      <Sidebar />
      <div class="flex flex-col flex-1 min-w-0">
        <Header />
        <Editor />
      </div>
    </div>

    <template #fallback>
      <!-- Todo: add fallback loading -->
    </template>
  </Suspense>
</template>
