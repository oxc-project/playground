<script setup lang="ts">
const commit = import.meta.env.OXC_COMMIT
</script>

<template>
  <div
    class="h-16 flex items-center justify-between border-b border-[#e2e2e3]/60 dark:border-[#2e2e32]/60"
  >
    <a
      class="group h-full w-full flex items-center transition-all"
      href="https://oxc.rs"
    >
      <img
        class="mr-2 h-7 w-7 transition-transform group-hover:rotate-12 group-hover:scale-110"
        src="https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/round.png"
        alt="logo"
      />
      <span
        class="text-lg text-[#3c3c43] font-semibold transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
      >
        Oxc
      </span>
    </a>
    <a
      :href="`https://github.com/oxc-project/oxc/commit/${commit}`"
      class="rounded px-2 py-1 text-xs font-mono opacity-50 transition-opacity hover:bg-[#e2e2e3]/30 hover:opacity-80 dark:hover:bg-[#2e2e32]/50"
      target="_blank"
      >@{{ commit.slice(0, 7) }}</a
    >
  </div>
</template>
