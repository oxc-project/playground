<script setup lang="ts">
const commit = import.meta.env.OXC_COMMIT
</script>

<template>
  <div
    class="h-16 flex items-center justify-between border-b border-[#e2e2e3] dark:border-[#2e2e32] mb-4"
  >
    <a class="h-full w-full flex items-center group transition-all duration-200 hover:scale-105" href="https://oxc.rs">
      <img
        class="mr-3 h-8 w-8 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
        src="https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/round.png"
        alt="Oxc Logo"
      />
      <div class="flex flex-col">
        <span
          class="text-lg font-bold text-[#3c3c43] dark:text-[#fffff5]/[.86]"
        >
          Oxc
        </span>
        <span class="text-xs -mt-1">
          Playground
        </span>
      </div>
    </a>
    <a
      v-if="commit"
      :href="`https://github.com/oxc-project/oxc/commit/${commit}`"
      class="text-xs font-mono opacity-50 transition-colors duration-200 px-2 py-1 rounded hover:opacity-75"
      target="_blank"
      >@{{ commit.slice(0, 7) }}</a
    >
  </div>
</template>
