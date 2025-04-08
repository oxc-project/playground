<script setup lang="ts">
const commit = import.meta.env.OXC_COMMIT
</script>

<template>
  <div
    class="h-16 flex items-center justify-between border-b border-[#e2e2e3] dark:border-[#2e2e32]"
  >
    <a class="h-full w-full flex items-center" href="https://oxc.rs">
      <img
        class="mr-2 h-6 w-6"
        src="https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/round.png"
        alt="logo"
      />
      <span
        class="text-base text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86]"
      >
        Oxc
      </span>
    </a>
    <a
      :href="`https://github.com/oxc-project/oxc/commit/${commit}`"
      text-xs
      font-mono
      op50
      target="_blank"
      >@{{ commit }}</a
    >
  </div>
</template>
