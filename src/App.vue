<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Header from "~/components/header/Header.vue";
import IoContainer from "~/components/IoContainer.vue";
import Sidebar from "~/components/sidebar/Sidebar.vue";
import { loadingOxc } from "~/composables/oxc";
</script>

<template>
  <Suspense>
    <div class="w-screen flex bg-white md:h-screen dark:bg-[#1b1b1f]">
      <Sidebar />
      <div class="min-w-0 flex flex-1 flex-col">
        <Header />
        <IoContainer />
      </div>
    </div>

    <template #fallback>
      <div class="h-screen w-screen flex flex-col items-center justify-center gap-4 text-2xl">
        <Icon icon="ri:loader-2-line" class="animate-spin text-6xl" />
        <span v-if="loadingOxc">Loading Oxc wasm...</span>
        <span v-else>Loading resources...</span>
      </div>
    </template>
  </Suspense>
</template>
