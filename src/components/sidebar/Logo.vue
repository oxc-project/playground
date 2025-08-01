<script setup lang="ts">
const commit = import.meta.env.OXC_COMMIT
</script>

<template>
  <div
    class="h-16 flex items-center justify-between border-b border-gray-200/80 dark:border-gray-700/80 mb-4"
  >
    <a class="h-full w-full flex items-center group transition-all duration-200 hover:scale-105" href="https://oxc.rs">
      <div class="relative mr-3">
        <img
          class="h-8 w-8 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
          src="https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/round.png"
          alt="Oxc Logo"
        />
        <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      <div class="flex flex-col">
        <span
          class="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
        >
          Oxc
        </span>
        <span class="text-xs text-gray-500 -mt-1 dark:text-gray-400">
          Playground
        </span>
      </div>
    </a>
    <a
      v-if="commit"
      :href="`https://github.com/oxc-project/oxc/commit/${commit}`"
      class="text-xs font-mono text-gray-400 hover:text-blue-500 transition-colors duration-200 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-500 dark:hover:text-blue-400"
      target="_blank"
      >@{{ commit.slice(0, 7) }}</a
    >
  </div>
</template>
