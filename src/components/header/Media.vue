<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
  <div
    class="hidden items-center before:ml-4 before:mr-2 before:h-6 before:w-px xl:flex before:bg-[#E5E4E7] before:content-[''] dark:before:bg-[#3B3440]"
  >
    <ul class="flex items-center">
      <li>
        <a
          class="mx-2 block"
          href="https://x.com/OxcProject"
          aria-label="x"
          target="_blank"
          rel="noopener"
        >
          <Icon
            icon="ri:twitter-x-fill"
            class="h-5 w-5 text-[#16171d] dark:text-white hover:text-[#0d6a73] dark:hover:text-[#32F3E9] transition-colors"
          />
        </a>
      </li>
      <li>
        <a
          class="mx-2 block"
          href="https://bsky.app/profile/boshen.github.io"
          aria-label="bluesky"
          target="_blank"
          rel="noopener"
        >
          <Icon
            icon="ri:bluesky-fill"
            class="h-5 w-5 text-[#16171d] dark:text-white hover:text-[#0d6a73] dark:hover:text-[#32F3E9] transition-colors"
          />
        </a>
      </li>
      <li>
        <a
          class="mx-2 block"
          href="https://discord.gg/9uXCAwqQZW"
          aria-label="discord"
          target="_blank"
          rel="noopener"
        >
          <Icon
            icon="ri:discord-fill"
            class="h-5 w-5 text-[#16171d] dark:text-white hover:text-[#0d6a73] dark:hover:text-[#32F3E9] transition-colors"
          />
        </a>
      </li>
      <li>
        <a
          class="mx-2 block"
          href="https://github.com/oxc-project/oxc"
          aria-label="github"
          target="_blank"
          rel="noopener"
        >
          <Icon
            icon="ri:github-fill"
            class="h-5 w-5 text-[#16171d] dark:text-white hover:text-[#0d6a73] dark:hover:text-[#32F3E9] transition-colors"
          />
        </a>
      </li>
    </ul>
  </div>
</template>
