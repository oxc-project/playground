<script setup lang="ts">
import {
  DiscordLogoIcon,
  GithubLogoIcon,
  TwitterLogoIcon,
} from "@radix-icons/vue";
</script>

<template>
  <div
    class="hidden xl:flex items-center before:content-[''] before:w-px before:h-6 before:ml-4 before:mr-2 before:bg-[#e2e2e3] dark:before:bg-[#2e2e32]"
  >
    <ul class="flex items-center">
      <li>
        <a
          class="block mx-2"
          href="https://twitter.com/boshen_c"
          aria-label="twitter"
          target="_blank"
          rel="noopener"
        >
          <TwitterLogoIcon
            class="block w-5 h-5 text-[#3c3c43]/[.78] dark:text-[#ebebf5]/[.6]"
          />
        </a>
      </li>
      <li>
        <a
          class="block mx-2"
          href="https://discord.gg/9uXCAwqQZW"
          aria-label="discord"
          target="_blank"
          rel="noopener"
        >
          <DiscordLogoIcon
            class="block w-5 h-5 text-[#3c3c43]/[.78] dark:text-[#ebebf5]/[.6]"
          />
        </a>
      </li>
      <li>
        <a
          class="block mx-2"
          href="https://github.com/oxc-project/oxc"
          aria-label="github"
          target="_blank"
          rel="noopener"
        >
          <GithubLogoIcon
            class="block w-5 h-5 text-[#3c3c43]/[.78] dark:text-[#ebebf5]/[.6]"
          />
        </a>
      </li>
    </ul>
  </div>
</template>
