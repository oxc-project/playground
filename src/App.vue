<script setup lang="ts">
import Header from '~/components/header/Header.vue'
import IoContainer from '~/components/IoContainer.vue'
import Sidebar from '~/components/sidebar/Sidebar.vue'
import { loadingOxc } from '~/composables/oxc'
</script>

<template>
  <Suspense>
    <div class="w-screen flex bg-white md:h-screen dark:bg-[#1b1b1f]">
      <Sidebar />
      <div class="min-w-0 flex flex-1 flex-col backdrop-blur-sm">
        <Header />
        <IoContainer />
      </div>
    </div>

    <template #fallback>
      <div
        class="h-screen w-screen flex flex-col items-center justify-center gap-6 bg-white dark:bg-[#1b1b1f]"
      >
        <div class="relative">
          <div class="i-ri:loader-2-line animate-spin text-6xl" />
        </div>
        <div class="text-center">
          <div class="text-2xl font-semibold mb-2">
            <span v-if="loadingOxc">Loading Oxc wasm...</span>
            <span v-else>Loading resources...</span>
          </div>
          <div class="text-sm">
            Please wait while we initialize the playground
          </div>
        </div>
        <div class="absolute bottom-8 text-xs">
          Powered by Oxc - The JavaScript Oxidation Compiler
        </div>
      </div>
    </template>
  </Suspense>
</template>
