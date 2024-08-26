<script setup lang="ts">
import LoadingIcon from "~icons/ri/loader-2-line";
import Editor from "src/components/Editor/Editor.vue";
import Header from "src/components/Header/Header.vue";
import Sidebar from "src/components/Sidebar/Sidebar.vue";
</script>

<template>
  <Suspense>
    <div class="flex w-screen md:h-screen bg-white dark:bg-[#1b1b1f]">
      <Sidebar />
      <div class="flex flex-col flex-1 min-w-0">
        <Header />
        <Editor />
      </div>
    </div>

    <template #fallback>
      <div
        class="flex flex-col gap-4 items-center justify-center text-2xl w-screen h-screen"
      >
        <LoadingIcon class="text-6xl animate-spin" />
        <span>Loading...</span>
      </div>
    </template>
  </Suspense>
</template>
