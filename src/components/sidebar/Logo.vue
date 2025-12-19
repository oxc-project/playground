<script setup lang="ts">
const commit = import.meta.env.OXC_COMMIT;
</script>

<template>
  <header
    class="h-16 flex items-center justify-between border-b border-[#e2e2e3] dark:border-[#2e2e32]"
  >
    <a
      class="h-full flex items-center transition-opacity hover:opacity-80"
      href="https://oxc.rs"
      aria-label="Oxc homepage"
    >
      <img
        class="mr-2 h-6 w-6"
        src="https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/round.png"
        alt="Oxc logo"
      />
      <span class="text-base text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86]"> Oxc </span>
    </a>
    <a
      :href="`https://github.com/oxc-project/oxc/commit/${commit}`"
      class="text-xs font-mono opacity-50 transition-opacity hover:opacity-100"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`View commit ${commit.slice(0, 7)}`"
    >
      @{{ commit.slice(0, 7) }}
    </a>
  </header>
</template>
