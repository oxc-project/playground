<script setup lang="ts">
import Header from '~/components/header/Header.vue'
import IoContainer from '~/components/IoContainer.vue'
import Sidebar from '~/components/sidebar/Sidebar.vue'
import { loadingOxc } from '~/composables/oxc'
</script>

<template>
  <Suspense>
    <div
      class="w-screen flex from-white via-blue-50/30 to-purple-50/20 bg-gradient-to-br md:h-screen dark:from-[#1b1b1f] dark:via-[#1b1b2f] dark:to-[#1f1b2f] dark:bg-gradient-to-br"
    >
      <Sidebar />
      <div class="min-w-0 flex flex-1 flex-col">
        <Header />
        <IoContainer />
      </div>
    </div>

    <template #fallback>
      <div
        class="h-screen w-screen flex flex-col items-center justify-center gap-6 from-white via-blue-50/30 to-purple-50/20 bg-gradient-to-br dark:from-[#1b1b1f] dark:via-[#1b1b2f] dark:to-[#1f1b2f] dark:bg-gradient-to-br"
      >
        <div class="relative">
          <div
            class="i-ri:loader-2-line animate-spin text-6xl text-blue-500 dark:text-blue-400"
          />
          <div
            class="i-ri:loader-2-line absolute inset-0 animate-ping text-6xl text-blue-500/20 dark:text-blue-400/20"
          />
        </div>
        <span
          v-if="loadingOxc"
          class="from-blue-600 to-purple-600 bg-gradient-to-r bg-clip-text text-2xl text-transparent font-medium dark:from-blue-400 dark:to-purple-400"
          >Loading Oxc wasm...</span
        >
        <span
          v-else
          class="from-blue-600 to-purple-600 bg-gradient-to-r bg-clip-text text-2xl text-transparent font-medium dark:from-blue-400 dark:to-purple-400"
          >Loading resources...</span
        >
        <div class="mt-4 flex gap-2">
          <div
            class="h-2 w-2 animate-bounce rounded-full bg-blue-500"
            style="animation-delay: 0ms"
          />
          <div
            class="h-2 w-2 animate-bounce rounded-full bg-purple-500"
            style="animation-delay: 150ms"
          />
          <div
            class="h-2 w-2 animate-bounce rounded-full bg-blue-500"
            style="animation-delay: 300ms"
          />
        </div>
      </div>
    </template>
  </Suspense>
</template>
