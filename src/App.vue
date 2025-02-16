<script setup lang="ts">
import Editor from '~/components/Editor/Editor.vue'
import Header from '~/components/Header/Header.vue'
import Sidebar from '~/components/Sidebar/Sidebar.vue'
import { loadingOxc } from '~/composables/oxc'
</script>

<template>
  <Suspense>
    <div class="w-screen flex bg-white md:h-screen dark:bg-[#1b1b1f]">
      <Sidebar />
      <div class="min-w-0 flex flex-1 flex-col">
        <Header />
        <Editor />
      </div>
    </div>

    <template #fallback>
      <div
        class="h-screen w-screen flex flex-col items-center justify-center gap-4 text-2xl"
      >
        <div class="i-ri:loader-2-line animate-spin text-6xl" />
        <span v-if="loadingOxc">Loading Oxc wasm...</span>
        <span v-else>Loading resources...</span>
      </div>
    </template>
  </Suspense>
</template>
