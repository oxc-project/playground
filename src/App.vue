<script setup lang="ts">
import Header from '~/components/header/Header.vue'
import IoContainer from '~/components/IoContainer.vue'
import Sidebar from '~/components/sidebar/Sidebar.vue'
import { loadingOxc } from '~/composables/oxc'
</script>

<template>
  <Suspense>
    <div class="w-screen flex bg-gradient-to-br from-gray-50 to-gray-100 md:h-screen dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div class="min-w-0 flex flex-1 flex-col backdrop-blur-sm">
        <Header />
        <IoContainer />
      </div>
    </div>

    <template #fallback>
      <div
        class="h-screen w-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div class="relative">
          <div class="i-ri:loader-2-line animate-spin text-6xl text-blue-500 dark:text-blue-400" />
          <div class="absolute inset-0 i-ri:loader-2-line animate-pulse text-6xl text-blue-300/50 dark:text-blue-600/50" />
        </div>
        <div class="text-center">
          <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            <span v-if="loadingOxc">Loading Oxc wasm...</span>
            <span v-else>Loading resources...</span>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we initialize the playground
          </div>
        </div>
        <div class="absolute bottom-8 text-xs text-gray-400 dark:text-gray-600">
          Powered by Oxc - The JavaScript Oxidation Compiler
        </div>
      </div>
    </template>
  </Suspense>
</template>
