<script setup lang="ts">
import LoadingIcon from '~icons/ri/loader-2-line'
import Editor from 'src/components/Editor/Editor.vue'
import Header from 'src/components/Header/Header.vue'
import Sidebar from 'src/components/Sidebar/Sidebar.vue'
import { loadingOxc } from 'src/composables/oxc'
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
        <LoadingIcon class="animate-spin text-6xl" />
        <span v-if="loadingOxc">Loading Oxc wasm...</span>
        <span v-else>Loading resources...</span>
      </div>
    </template>
  </Suspense>
</template>
