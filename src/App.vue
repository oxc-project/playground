<script setup lang="ts">
import Header from "./components/Header/Header.vue";
import Sidebar from "./components/Sidebar/Sidebar.vue";
</script>

<template>
  <Suspense>
    <main class="flex w-screen h-screen bg-white dark:bg-[#1b1b1f]">
      <Sidebar />
      <div class="flex w-screen">
        <Header />
        <div>
          <!-- Todo: Editor Component -->
        </div>
      </div>
    </main>

    <template #fallback>
      <!-- Todo: add fallback loading -->
    </template>
  </Suspense>
</template>
